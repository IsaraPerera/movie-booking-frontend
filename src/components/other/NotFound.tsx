export const NotFound = () => {
    return (
        <>
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    {/* FIX: was "401" (Unauthorized) — this component is routed
                        as the catch-all `path='*'` fallback, i.e. a 404 page. */}
                    <h1 className="text-6xl font-bold">404</h1>
                    <p className="mt-4 text-gray-600">
                        The page you are looking for does not exist
                    </p>
                </div>
            </div>
        </>
    )
}