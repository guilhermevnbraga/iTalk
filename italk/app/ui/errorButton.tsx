interface ErrorButtonProps {
    error: string;
}

export default function ErrorButton({ error }: ErrorButtonProps) {
    return (
        <div className="ml-2 sm:ml-4 text-xs sm:text-sm mb-2">
            {error && (
                <span className="block w-full text-left text-red-500 font-medium">
                    {error}
                </span>
            )}
        </div>
    );
}
