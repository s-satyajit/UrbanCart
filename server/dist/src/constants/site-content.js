export const navigationLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "Cart", to: "/cart" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Orders", to: "/orders" },
    { label: "Profile", to: "/profile" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];
export const aboutContent = {
    eyebrow: "About Urban Cart",
    title: "Urban Cart is built to feel like a modern retail brand, not a demo shell.",
    description: "Urban Cart combines a polished storefront, real backend infrastructure, persistent customer accounts, and AI-assisted support to create a believable ecommerce experience.",
    story: "We designed Urban Cart as a high-trust digital storefront where product discovery, customer support, and checkout all feel connected. Every major customer action now flows through the backend so the experience feels consistent, fast, and reliable.",
    mission: "Make online shopping feel transparent, dependable, and easy to navigate from first visit to post-purchase support.",
    highlights: [
        "MongoDB-backed persistence for accounts, carts, wishlists, orders, and messages",
        "Session-based sign in stored locally for one day with backend validation",
        "Razorpay-ready checkout architecture for real payment collection",
        "Gemini-powered smart FAQs grounded in Urban Cart store data",
    ],
    values: [
        {
            title: "Fast decisions",
            description: "Customers should understand products, policies, and checkout expectations without hunting through the site.",
        },
        {
            title: "Reliable operations",
            description: "Important flows such as account sessions, carts, orders, and support messages are backed by real API and database logic.",
        },
        {
            title: "Human-friendly support",
            description: "Store answers should sound clear and useful, whether they come from the support team or the AI assistant.",
        },
    ],
    policies: [
        {
            title: "Delivery",
            description: "Urban Cart is designed around standard delivery expectations of roughly 2 to 5 business days for ready-to-ship products.",
        },
        {
            title: "Returns",
            description: "We support a simple return path for unused items, with customers encouraged to contact support first for confirmation and guidance.",
        },
        {
            title: "Payments",
            description: "Checkout is structured for secure online payment through Razorpay when account credentials are configured.",
        },
        {
            title: "Support",
            description: "Customers can reach Urban Cart by email or phone, and the About page now includes an AI assistant for fast policy and store questions.",
        },
    ],
    faqSuggestions: [
        "Do you deliver fast?",
        "How do returns work?",
        "Is checkout secure on Urban Cart?",
        "What kind of products do you sell?",
        "How can I contact support?",
    ],
};
export const contactChannels = [
    {
        id: "support",
        title: "Support Desk",
        value: "satyajit.samal@outlook.in",
        description: "Product issues, refunds, and help with orders.",
    },
    {
        id: "phone",
        title: "Phone",
        value: "+91 9348569512",
        description: "Monday to Saturday, 9 AM to 6 PM.",
    },
];
