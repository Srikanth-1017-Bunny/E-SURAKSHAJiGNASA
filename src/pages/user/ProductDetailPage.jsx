import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, timeAgo } from '../../utils/formatting';
import { FaMapMarkerAlt, FaShareAlt, FaHeart, FaUserCircle } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { getProductById } = useProducts();
    const { currentUser } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            const data = await getProductById(id);
            setProduct(data);
            setLoading(false);
        };
        loadProduct();
    }, [id, getProductById]);

    const handleStartChat = async () => {
        if (!currentUser || !product) return;

        try {
            // Check if chat for this specific product already exists
            const chatsRef = collection(db, 'chats');
            const q = query(
                chatsRef,
                where('productId', '==', id),
                where('participants', 'array-contains', currentUser.uid)
            );
            const snapshot = await getDocs(q);

            let existingChat = null;
            snapshot.forEach(doc => {
                const data = doc.data();
                // Ensure the other participant is the seller
                if (data.participants.includes(product.sellerId)) {
                    existingChat = doc.id;
                }
            });

            if (existingChat) {
                navigate(`/user/chats/${existingChat}`);
            } else {
                // Create new chat with product context
                const newChatRef = await addDoc(chatsRef, {
                    participants: [currentUser.uid, product.sellerId],
                    productId: id,
                    productTitle: product.title,
                    productImage: product.images?.[0] || null,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    lastMessage: { text: 'Started a conversation', senderId: currentUser.uid, createdAt: serverTimestamp() }
                });
                navigate(`/user/chats/${newChatRef.id}`);
            }
        } catch (error) {
            console.error("Error starting chat:", error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!product) return <div className="p-8 text-center">Product not found.</div>;

    const isOwner = currentUser?.uid === product.sellerId;

    return (
        <div className="min-h-screen bg-gray-50">
            {!currentUser && <Navbar />} {/* Show Navbar if public view */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:underline">Home</Link> /
                    <span className="mx-2">{product.category}</span> /
                    <span className="text-gray-900 font-medium ml-2">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            {product.images?.[activeImage] ? (
                                <img src={product.images[activeImage]} className="w-full h-full object-contain" alt="Product" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images?.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${activeImage === idx ? 'border-primary-600' : 'border-transparent'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                <span className="bg-gray-100 px-2 py-1 rounded">{product.condition}</span>
                                <span>•</span>
                                <time>{timeAgo(product.createdAt)}</time>
                            </div>

                            <div className="text-4xl font-bold text-emerald-600 mb-6 font-primary">
                                {formatCurrency(product.price)}
                                {product.condition === 'not-working' && <span className="text-sm font-medium text-gray-500 ml-2">Eco-Coins</span>}
                            </div>

                            {!currentUser ? (
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                                    <p className="text-blue-800 font-medium">Want to buy this item?</p>
                                    <p className="text-sm text-blue-600 mb-3">Log in or sign up to contact the seller and make a purchase.</p>
                                    <div className="flex gap-3">
                                        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Login</Link>
                                        <Link to="/signup" className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm">Sign Up</Link>
                                    </div>
                                </div>
                            ) : (
                                isOwner ? (
                                    <Link to="/user/my-products" className="flex-1 text-center bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium">
                                        Manage Product
                                    </Link>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                        <button
                                            onClick={async () => {
                                                if (!currentUser || !product) return;

                                                if (!product.sellerId) {
                                                    console.error("No sellerId found for product:", product);
                                                    alert("Error: This product has no seller information.");
                                                    return;
                                                }

                                                try {
                                                    const sellerDoc = await getDoc(doc(db, 'users', product.sellerId));

                                                    if (!sellerDoc.exists()) {
                                                        console.error("Seller document not found for ID:", product.sellerId);
                                                        alert("Error: Seller information could not be retrieved.");
                                                        return;
                                                    }

                                                    const sellerData = sellerDoc.data();
                                                    const sellerEmail = sellerData?.email;

                                                    if (!sellerEmail) {
                                                        console.error("Seller has no email address:", sellerData);
                                                        alert("Error: Seller has not provided an email address.");
                                                        return;
                                                    }

                                                    const buyerAddress = currentUser.address || {};
                                                    const street = buyerAddress.street || 'Not specified';
                                                    const city = buyerAddress.city || '';
                                                    const state = buyerAddress.state || '';
                                                    const pincode = buyerAddress.pincode || '';

                                                    const fullAddress = city
                                                        ? `${street}, ${city}, ${state} - ${pincode}`
                                                        : 'Address not provided';

                                                    const subject = encodeURIComponent(`Purchase Inquiry for ${product.title}`);
                                                    const body = encodeURIComponent(
                                                        `Hi ${product.sellerName || 'Seller'},\n\n` +
                                                        `I am interested in buying your product: ${product.title} listed for ${formatCurrency(product.price)}.\n\n` +
                                                        `Delivery Address:\n${fullAddress}\n\n` +
                                                        `Please let me know if it's still available.\n\n` +
                                                        `Thanks,\n${currentUser.name || currentUser.username || currentUser.email}`
                                                    );

                                                    const mailtoUrl = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;

                                                    // Create a temporary link and click it for better browser compatibility
                                                    const link = document.createElement('a');
                                                    link.href = mailtoUrl;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);

                                                } catch (error) {
                                                    console.error("Error redirecting to email:", error);
                                                    alert("Failed to open email client. Please try again.");
                                                }
                                            }}
                                            className="flex-1 bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 font-bold transition-all shadow-lg shadow-emerald-200"
                                        >
                                            Buy Now
                                        </button>
                                        <button
                                            onClick={handleStartChat}
                                            className="flex-1 border-2 border-emerald-600 text-emerald-600 py-4 rounded-xl hover:bg-emerald-50 font-bold transition-all"
                                        >
                                            Chat with Seller
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="font-semibold text-lg mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                        </div>

                        <div className="border-t mt-6 pt-6">
                            <h3 className="font-semibold text-lg mb-3">Seller Location</h3>
                            <div className="flex items-start gap-2 text-gray-600">
                                <FaMapMarkerAlt className="mt-1 text-primary-500" />
                                <div>
                                    <p>{product.location?.city}, {product.location?.state}</p>
                                    <p className="text-sm text-gray-400">{product.location?.pincode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
