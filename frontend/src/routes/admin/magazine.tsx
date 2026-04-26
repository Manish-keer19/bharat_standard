import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import { mediaService } from "@/services/media.service";
import { toast } from "sonner";
import { ImageIcon, Loader2, Upload, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin/magazine")({
  component: AdminMagazineCover,
});

function AdminMagazineCover() {
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCover();
    }, []);

    const fetchCover = async () => {
        try {
            const res = await adminService.getMagazine();
            if (res.success && res.data) {
                setCurrentImageUrl(res.data.imageUrl);
            }
        } catch (error) {
            console.error("Failed to load cover", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        if (!selectedFile) return toast.error("Please select an image first");

        setIsSubmitting(true);
        const loadingToast = toast.loading("Updating magazine cover...");
        
        try {
            const cloudUrl = await mediaService.uploadImage(selectedFile);
            const res = await adminService.updateMagazine({ imageUrl: cloudUrl });
            
            if (res.success) {
                toast.success("Cover updated successfully!");
                setCurrentImageUrl(cloudUrl);
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
            toast.dismiss(loadingToast);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto animate-fade-up">
            <h2 className="section-title">Visual Identity</h2>
            <Card className="rounded-none border-rule shadow-none bg-surface overflow-hidden">
                <div className="p-8 text-center border-b border-rule bg-white">
                    <h2 className="text-2xl font-serif font-bold text-ink">Edition Cover</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mt-2">Homepage Featured Asset Management</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Image Display */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full max-w-[240px] aspect-[3/4] rounded-none overflow-hidden bg-white border border-rule shadow-2xl flex flex-col items-center justify-center text-center group card-news">
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                </>
                            ) : currentImageUrl ? (
                                <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-6 opacity-20 flex flex-col items-center">
                                    <ImageIcon className="w-16 h-16 mb-4 text-ink" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-ink">No Cover Set</p>
                                </div>
                            )}
                        </div>
                        {previewUrl && (
                            <div className="mt-4 px-4 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-widest animate-pulse">
                                Pending Verification
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        
                        {!previewUrl ? (
                            <Button 
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="w-full py-8 rounded-none border-rule border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all font-bold uppercase tracking-widest text-xs gap-3 text-ink"
                            >
                                <ImageIcon className="w-5 h-5 text-primary" />
                                Select Digital Asset
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={handleUpdate}
                                    disabled={isSubmitting}
                                    className="w-full py-8 rounded-none bg-primary text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20 hover:bg-primary/90"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                    Authorize Update
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                        setPreviewUrl(null);
                                        setSelectedFile(null);
                                    }}
                                    className="text-ink-muted text-[10px] font-bold uppercase tracking-widest hover:text-primary"
                                >
                                    Cancel Request
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
            
            <div className="mt-8 p-6 border-l-4 border-primary bg-surface italic text-sm text-ink-muted">
                <p>Note: The edition cover is the primary visual anchor for the Bharat Standard homepage. Ensure the asset meets high-resolution editorial standards.</p>
            </div>
        </div>
    );
}
