interface ErrorButtonProps {
    error: string;
}

export default function ErrorButton({ error }: ErrorButtonProps) {
    return (
        <div className="ml-2 text-sm mb-2">
            {error && <span className="w-full text-left text-red-500 font-medium">{error}</span>}
        </div>
    )
}