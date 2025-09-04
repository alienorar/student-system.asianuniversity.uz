"use client"

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CameraIcon, RefreshCcw } from "lucide-react"
import { useUploadFile, useStartLesson } from "../hooks/mutations"
import { toast } from "sonner"

interface CameraModalProps {
    visible: boolean
    onClose: () => void
    lessonId: string | null
}

const CameraModal = ({ visible, onClose, lessonId }: CameraModalProps) => {
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null)
    const [capturedImageBlob, setCapturedImageBlob] = useState<Blob | null>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const uploadFileMutation = useUploadFile()
    const startLessonMutation = useStartLesson()
    const isProcessing = uploadFileMutation.isPending || startLessonMutation.isPending

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user", // Explicitly use front-facing camera
                },
                audio: false,
            })
            setStream(mediaStream)
            setCapturedImageSrc(null)
            setCapturedImageBlob(null)
        } catch (error) {
            console.error("Error accessing camera:", error)
            toast("Kameraga kirishda xatolik. Iltimos, kameraga ruxsat berganingizga ishonch hosil qiling.", {
                style: { background: "#f87171", color: "#fff" },
            })
        }
    }

    useEffect(() => {
        if (visible) {
            startCamera()
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
                setStream(null)
            }
        }
    }, [visible])

    useEffect(() => {
        if (videoRef.current && stream && visible) {
            videoRef.current.srcObject = stream
            const video = videoRef.current
            const playPromise = video.play()

            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error("Video play error:", error)
                })
            }
        }
    }, [stream, visible])

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const context = canvas.getContext("2d")
            if (context) {
                // Flip the canvas horizontally to correct mirroring
                context.scale(-1, 1)
                context.translate(-canvas.width, 0)
                context.drawImage(video, 0, 0, canvas.width, canvas.height)
                // Reset the transformation to avoid affecting future draws
                context.scale(-1, 1)
                context.translate(canvas.width, 0)

                const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
                setCapturedImageSrc(imageDataUrl)

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            setCapturedImageBlob(blob)
                        }
                    },
                    "image/jpeg",
                    0.9,
                )

                if (stream) {
                    stream.getTracks().forEach((track) => track.stop())
                    setStream(null)
                }
            }
        }
    }

    const retakePhoto = async () => {
        setCapturedImageSrc(null)
        setCapturedImageBlob(null)
        await startCamera()
    }

    const handleUploadAndStartLesson = async () => {
        if (!capturedImageBlob || !lessonId) {
            toast("Rasm topilmadi yoki dars IDsi mavjud emas.", {
                style: { background: "#f87171", color: "#fff" },
            })
            return
        }

        try {
            const uploadResult = await uploadFileMutation.mutateAsync(capturedImageBlob)
            console.log(uploadResult, "upload")

            const imageId = uploadResult?.id.file_path
            console.log(imageId, "file path")

            await startLessonMutation.mutateAsync({
                lessonId,
                imageUrl: `https://edu.asianuniversity.uz${imageId}`,
            })
            toast("Dars muvaffaqiyatli boshlandi.", {
                style: { background: "#34d399", color: "#fff" },
            })
            onClose()
        } catch (error) {
            console.error("Yuklash yoki darsni boshlashda xatolik:", error)
        }
    }

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-card rounded-lg">
                <DialogHeader>
                    <DialogTitle>{capturedImageSrc ? "Olingan rasm" : "Kamera"}</DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>
                <div className="flex justify-center relative w-full h-auto aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${capturedImageSrc ? "hidden" : "block"} transform scale-x-[-1]`} // Unmirror the video feed
                    />
                    {capturedImageSrc && (
                        <img
                            src={capturedImageSrc}
                            alt="Olingan rasm"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    {!stream && !capturedImageSrc && (
                        <p className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-card/80">
                            Kamera yuklanmoqda...
                        </p>
                    )}
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
                <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 p-4">
                    {capturedImageSrc ? (
                        <>
                            <Button
                                onClick={retakePhoto}
                                variant="outline"
                                disabled={isProcessing}
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" /> Qayta olish
                            </Button>
                            <Button
                                onClick={handleUploadAndStartLesson}
                                disabled={isProcessing}
                                className="bg-sky-500 text-white hover:bg-sky-800"
                            >
                                {isProcessing ? "Yuklanmoqda..." : "Yuklash va darsni boshlash"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={capturePhoto}
                                disabled={!stream}
                                className="bg-sky-500 text-white hover:bg-primary/90"
                            >
                                <CameraIcon className="mr-2 h-4 w-4" /> Rasmga olish
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="destructive"
                            >
                                Kamerani yopish
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CameraModal