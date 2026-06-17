"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { uploadPlaylist, updatePlaylist, uploadFile, deleteItem } from "@/app/utils/data/data";
import { Playlist } from "@/app/utils/data/type";
import { SecondaryBtn, PrimaryBtn } from "@/app/ui/components/Buttons";

type Props = {
    showEditor: boolean;
    setShowEditor: (val: boolean) => void;
    playlist?: Playlist;
};

type PlaylistForm = {
    name: string;
    bannerUrl?: string;
};

export default function PlaylistEditor({ playlist, showEditor = true, setShowEditor }: Props) {
    const [bannerFile, setBannerFile] = useState<File | undefined>();

    const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<PlaylistForm>({
        defaultValues: {
            name: playlist?.name,
            bannerUrl: playlist?.banner,
        },
    });

    const onSubmit = async (data: PlaylistForm) => {
        if (!data.name) return;

        let bannerToSend = data.bannerUrl ?? playlist?.banner ?? "";

        if (bannerFile) {
            const uploadedUrl = await uploadFile("playlistsBanner", bannerFile, data.name);
            if (!uploadedUrl) {
                window.alert(`Failed uploading ${bannerFile}`);
                return;
            }
            bannerToSend = uploadedUrl;
            setValue("bannerUrl", uploadedUrl);
        }

        if (!playlist && !bannerToSend) {
            window.alert("Playlist banner is required for creating a playlist.");
            return;
        }

        let res: null | number;
        if (playlist) {
            res = await updatePlaylist({ id: playlist.id, name: data.name, banner: bannerToSend });
        } else {
            res = await uploadPlaylist({ name: data.name, banner: bannerToSend });
        }

        if (res === null) {
            window.alert(playlist ? `Failed updating ${playlist.name}` : "Failed creating playlist");
            return;
        }

        window.alert(playlist ? `${playlist.name} is Updated Successfully!` : "Playlist created successfully!");
        setShowEditor(false);
        return;
    };

    const handleDelete = async () => {
        if (!playlist) return;

        const userConfirmed = window.confirm("Are you sure you want to delete this Playlist?");
        if (userConfirmed) {
            const res = await deleteItem("Artists", playlist.id);
            if (res) window.alert(`${playlist.name} is Removed!`);
            else window.alert(`Failed Deleting ${playlist.name}`);
        }
    };
    if (!showEditor) return null;

    return (
        <div className="absolute z-50 left-0 right-0 mx-auto w-full max-w-2xl flex flex-col max-h-[calc(100vh-81px)] bg-card-bg border border-card-border rounded-lg shadow-2xl backdrop-blur-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-card-border bg-dark-bg flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight text-primary">Playlist Editor</h1>
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
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-secondary">Playlist Banner</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBannerFile(e.target.files?.[0])}
                            className="bg-dark-bg border-card-border w-full rounded-md border py-1 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-btn file:text-primary hover:file:bg-opacity-80 transition-all cursor-pointer"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-secondary">Playlist Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Playlist name..."
                            className="bg-dark-bg border-card-border w-full text-lg rounded-md border px-2 py-1 text-primary focus:outline-none focus:ring-1 focus:ring-accent-from transition-all"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center py-2">
                    <div>
                        {playlist && <SecondaryBtn
                            type="button"
                            onClick={handleDelete}
                            className="text-red-400 hover:bg-red-600 hover:text-primary transition-all"
                        >
                            Delete
                        </SecondaryBtn>}
                    </div>
                    <SecondaryBtn type="submit" disabled={isSubmitting} className="font-bold transition-all hover:bg-green-500/50">
                        {playlist ? (isSubmitting ? "Saving..." : "Save") : (isSubmitting ? "Creating..." : "Creat")}
                    </SecondaryBtn>
                </div>

                {/* keep RHF hidden fields in sync */}
                <input type="hidden" {...register("bannerUrl")} />
            </form>
        </div>
    );
}