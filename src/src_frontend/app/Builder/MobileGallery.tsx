import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/ui/Button";


interface Image {
    url: string;
    file_type?: string;
    title?: string;
    originalIndex: number;
  }
  

interface GalleryProps {
    filteredImages: Image[];
}

export default function MobileGallery({ filteredImages }: GalleryProps) {
    const categories = ["All", ...new Set(filteredImages.map((img) => img.title))];
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const filteredImagesToDisplay: Image[] =
        selectedCategory === "All"
            ? filteredImages
            : filteredImages.filter((img) => img.title === selectedCategory);
    return (
        <div className="relative">
            <div className="flex gap-4 my-2 overflow-auto">
                {categories.map((category) => (
                    <Button
                    className={`${selectedCategory === category ? "border-b-2 border-primary text-primary" : ""} bg-transparent rounded-none`}
                        key={category}
                        onClick={() => setSelectedCategory(category || "All")}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <div className="flex flex-col !justify-start gap-2 overflow-auto h-[calc(100vh-150px)] pb-16">
                {filteredImagesToDisplay.map((image,filteredIndex) => (
                    <Dialog key={image.originalIndex} onOpenChange={() => setSelectedImage(image?.url)}>
                        <DialogTrigger className="h-fit border p-1 rounded-xl shadow-custom">
                           
                             {image.title && (
                                                        <label className="text-black text-xs p-1 rounded flex gap-1 items-center my-1">
                                                           {image.title}
                                                        </label>
                                                      )}
                                {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                                    <div className="relative">
                                                      <img
                                                        src={image.url}
                                                        alt={`Image ${filteredIndex + 1}`}
                                                     className="w-full h-72 object-cover rounded-xl cursor-pointer hover:opacity-80 transition border"
                                                      />
                                                     
                                                    </div>
                                                  ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video
                                                      src={image.url}
                                                      controls
                                                      className="border object-contain max-w-full bg-black rounded-xl"
                                                      style={{
                                                        width:  "100vw",
                                                        height: "70vh",
                                                        maxHeight: "80vh",
                                                      }}
                                                    />
                                                  ) : null}
                        </DialogTrigger>
                    </Dialog>
                ))}
            </div>

            {selectedImage && (
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className=" w-full flex flex-col items-center left-0 top-1/2 -translate-y-1/2 text-white p-2 border-none">
                    <DialogTitle></DialogTitle>
                        {/* <Button variant="ghost" className="absolute top-2 right-2" onClick={() => setSelectedImage(null)}>
                            <X className="w-6 h-6" />
                        </Button> */}
                        <img src={selectedImage} alt="Selected" className="w-full max-h-screen object-contain" />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
