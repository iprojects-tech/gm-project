"use client"
import React, { useState } from "react";

export type ImageData = {
    src: string;
    source: string;
    page?: number;
};

export default function ImageThumbnails({ images }: { images: ImageData[] }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    if (!images?.length) return null;

    return (
        <div>
            <div style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                margin: "2rem 0"
            }}>
                {images.map((img, idx) => (
                    <div key={idx} style={{ cursor: "pointer", textAlign: "center" }}>
                        <img
                            src={`http://localhost:8000${img.src.startsWith('/') ? '' : '/'}${img.src}`}
                            alt={`Imagen ${idx}`}
                            style={{
                                width: 160,
                                height: 160,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #ccc",
                                marginBottom: 4,
                                boxShadow: "0 2px 8px #0002"
                            }}
                            onClick={() => setOpenIdx(idx)}
                        />
                        <div style={{ fontSize: 10, color: "#888" }}>
                            <span>{img.source}{img.page && ` (p. ${img.page})`}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para la imagen ampliada */}
            {openIdx !== null && images[openIdx] && (
                <div
                    style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.75)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => setOpenIdx(null)}
                >
                    <div
                        style={{ position: "relative", maxWidth: "80vw", maxHeight: "80vh" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={`http://localhost:8000${images[openIdx].src.startsWith('/') ? '' : '/'}${images[openIdx].src}`}
                            alt=""
                            style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 6, boxShadow: "0 0 30px #0009" }}
                        />

                        <div style={{
                            color: "#fff", textAlign: "center", marginTop: 8, fontSize: 16,
                            background: "rgba(0,0,0,0.5)", borderRadius: 4, padding: "6px 16px"
                        }}>
                            {images[openIdx].source} {images[openIdx].page && `(p. ${images[openIdx].page})`}
                        </div>
                        <button
                            style={{
                                position: "absolute", top: 6, right: 6,
                                background: "#fff", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer"
                            }}
                            onClick={() => setOpenIdx(null)}
                        >✕</button>
                    </div>
                </div>
            )}
        </div>
    );
}
