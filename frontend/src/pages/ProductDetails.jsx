
import { Link } from "react-router-dom";
import { HiShoppingBag, HiArrowLeft } from "react-icons/hi";

function ProductDetails({ product, storeName, storeSlug }) {
    // Handle inactive products.
    if (product?.status === "inactive") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <HiShoppingBag className="mb-4 h-16 w-16 text-gray-300" />

                <h1 className="text-2xl font-bold text-gray-900">
                    Product Unavailable
                </h1>

                <p className="mt-2 text-gray-500">
                    Sorry, this product is currently unavailable.
                </p>

                <Link
                    to={`/s/${storeSlug}`}
                    className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
                >
                    Back to Store
                </Link>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <HiShoppingBag className="mb-4 h-16 w-16 text-gray-300" />

                <h1 className="text-2xl font-bold text-gray-900">
                    Product Not Found
                </h1>

                <p className="mt-2 text-gray-500">
                    This product may have been removed or is unavailable.
                </p>

                <Link
                    to={`/s/${storeSlug}`}
                    className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
                >
                    Back to Store
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                <Link
                    to={`/s/${storeSlug}`}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-orange-600"
                >
                    <HiArrowLeft className="h-4 w-4" />
                    Back to Store
                </Link>

                <div className="grid gap-10 md:grid-cols-2 md:items-start">

                    {/* Product Image */}
                    <div className="overflow-hidden rounded-2xl bg-gray-100">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="aspect-square w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50">
                                <HiShoppingBag className="h-24 w-24 text-orange-300" />
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="py-2">

                        {product.category && (
                            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
                                {product.category}
                            </p>
                        )}

                        <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mt-5 text-2xl font-bold text-gray-900">
                            {product.price}
                        </p>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <h2 className="text-sm font-bold text-gray-900">
                                Product Description
                            </h2>

                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                                {product.description || "No description available for this product."}
                            </p>
                        </div>

                        <div className="mt-8">
                            <button
                                type="button"
                                disabled
                                className="w-full cursor-not-allowed rounded-full bg-gray-300 px-8 py-4 text-sm font-bold text-gray-600"
                                title="Cart functionality will be connected in a later step."
                            >
                                Add to Cart
                            </button>

                            <p className="mt-3 text-center text-xs text-gray-400">
                                Sold by {storeName}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProductDetails;
