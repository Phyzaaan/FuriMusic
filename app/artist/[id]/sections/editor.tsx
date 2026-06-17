"use client";
import { useForm } from "react-hook-form";

import {
    deleteItem,
    updateArtist,
    uploadArtist,
    uploadFile,
} from "@/app/utils/data/data";
import { Artist } from "@/app/utils/data/type";
import { SecondaryBtn, PrimaryBtn } from "@/app/ui/components/Buttons";
import { useState } from "react";

interface Props {
    artist?: Artist;
    showEditor: boolean;
    setShowEditor: (val: boolean) => void;
}

type ArtistForm = {
    id?: number;
    name: string;
    bannerUrl?: string;
};

export default function ArtistEditor({ artist, showEditor, setShowEditor }: Props) {
    const [bannerFile, setBannerFile] = useState<File | undefined>();

    const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<ArtistForm>({
        defaultValues: {
            id: artist?.id,
            name: artist?.name,
            bannerUrl: artist?.banner,
        },
    });

    const onSubmit = async (data: ArtistForm) => {
        if (!data.name) return;

        let bannerToSend = data.bannerUrl ?? artist?.banner ?? "";

        if (bannerFile) {
            const uploadedUrl = await uploadFile("artistsBanner", bannerFile, data.name);
            if (!uploadedUrl) {
                window.alert(`Failed uploading ${bannerFile}`);
                return;
            }
            bannerToSend = uploadedUrl;
            setValue("bannerUrl", uploadedUrl);
        }

        if (!artist && !bannerToSend) {
            window.alert("Artist banner is required for creating an artist.");
            return;
        }

        if (artist) {
            const updated = await updateArtist({
                id: data.id as number,
                name: data.name,
                banner: bannerToSend,
            });

            if (!updated) {
                window.alert(`Failed updating ${artist.name}`);
                return;
            }

            window.alert(`${artist.name} is Updated Successfully!`);
        } else {
            const id = await uploadArtist({ name: data.name, banner: bannerToSend });
            if (!id) {
                window.alert("Failed creating artist");
                return;
            }
            window.alert("Artist created successfully!");
        }
        setShowEditor(false);
        return;
    };

    const handleDelete = async () => {
        if (!artist) return;
        const userConfirmed = window.confirm("Are you sure you want to delete this Artist?");
        if (userConfirmed) {
            const res = await deleteItem("Artists", artist.id);
            if (res) window.alert(`${artist.name} is Removed!`);
            else window.alert(`Failed Deleting ${artist.name}`);
        }
    };

    if (!showEditor) return null;

    return (
        <div className="absolute z-30 left-0 right-0 mx-auto w-full max-w-2xl flex flex-col max-h-[calc(100vh-81px)] bg-card-bg border border-card-border rounded-lg shadow-2xl backdrop-blur-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-card-border bg-dark-bg flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight text-primary">{artist ? "Edit Artist" : "Create Artist"}</h1>
                <PrimaryBtn
                    type="button"
                    icon="/icons/close.svg"
                    width={24}
                    height={24}
                    onClick={() => setShowEditor(false)}
                />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-2 py-1 flex flex-col gap-2 no-scrollbar">
                <div className="flex items-center w-full gap-2 py-1">
                    {/* Banner Section */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-secondary">Artist Banner</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBannerFile(e.target.files?.[0])}
                            className="bg-dark-bg border-card-border w-full rounded-md border py-1 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-btn file:text-primary hover:file:bg-opacity-80 transition-all cursor-pointer"
                        />
                    </div>

                    {/* Name Section */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-secondary">Artist Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Artist name..."
                            className="bg-dark-bg border-card-border w-full text-lg rounded-md border px-2 py-1 text-primary focus:outline-none focus:ring-1 focus:ring-accent-from transition-all"
                        />
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className=" flex justify-between items-center py-2">
                    {artist && (
                        <SecondaryBtn
                            type="button"
                            onClick={handleDelete}
                            className="text-red-400 hover:bg-red-600 hover:text-primary transition-all"
                        >
                            Delete
                        </SecondaryBtn>
                    )}

                    <SecondaryBtn
                        type="submit"
                        disabled={isSubmitting}
                        className="font-bold transition-all hover:bg-green-500/50"
                    >
                        {artist ? (isSubmitting ? "Saving..." : "Save") : (isSubmitting ? "Creating..." : "Creat")}
                    </SecondaryBtn>
                </div>
            </form>

            {/* hidden fields - maintain RHF shape */}
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("bannerUrl")} />
        </div>
    );
}