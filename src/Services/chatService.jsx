/**
 * Chat Service - A simulated AI chat service
 * In a real implementation, this would connect to a backend server
 */

// Sample product data
const productData = [
    {
        id: 1,
        name: "Traditional Fish Fry",
        description: "Authentic Maldivian style fish fry made with local spices.",
        price: "$12.99",
        url: "/products/fish-fry",
        ingredients: "Fresh tuna, garlic, ginger, curry leaves, Maldivian spices, vegetable oil",
        popularity: "Bestseller"
    },
    {
        id: 2,
        name: "Premium Achcharu",
        description: "Sweet and spicy achcharu made with fresh mango and local chilies.",
        price: "$8.99",
        url: "/products/achcharu",
        ingredients: "Fresh mango, Maldivian chili, salt, sugar, lime juice, natural preservatives",
        popularity: "Popular"
    },
    {
        id: 3,
        name: "Dhivehi Spice Mix",
        description: "Special blend of traditional Maldivian spices for various dishes.",
        price: "$9.99",
        url: "/products/spice-mix",
        ingredients: "Cumin, coriander, cardamom, cinnamon, black pepper, dried chili",
        popularity: "New arrival"
    },
    {
        id: 4,
        name: "Maldivian Chili Paste",
        description: "Hot and flavorful chili paste, perfect for adding heat to any dish.",
        price: "$7.99",
        url: "/products/chili-paste",
        ingredients: "Local Maldivian chilies, garlic, salt, vegetable oil, natural preservatives",
        popularity: "Spicy favorite"
    },
    {
        id: 5,
        name: "Coconut Sambol",
        description: "Traditional coconut condiment with a perfect balance of spices.",
        price: "$6.99",
        url: "/products/coconut-sambol",
        ingredients: "Fresh coconut, Maldivian chili, onion, lime juice, salt",
        popularity: "Traditional favorite"
    }
];

// Knowledge base for AI responses
const knowledgeBase = {
    products: {
        general: "We offer a variety of authentic Maldivian products including Traditional Fish Fry, Premium Achcharu, Dhivehi Spice Mix, Maldivian Chili Paste, and Coconut Sambol.",
        bestsellers: "Our bestsellers are Traditional Fish Fry and Premium Achcharu. Customers love these products for their authentic Maldivian flavors.",
        new: "Our newest product is the Dhivehi Spice Mix, specially formulated after extensive research into traditional Maldivian cooking.",
        organic: "Yes, we prioritize using organic ingredients whenever possible. Our products contain minimal preservatives and focus on natural ingredients.",
        vegetarian: "Our Premium Achcharu, Dhivehi Spice Mix, Maldivian Chili Paste, and Coconut Sambol are vegetarian. Only our Fish Fry contains animal products."
    },
    ordering: {
        process: "To place an order, browse our products page, add items to your cart, and proceed to checkout. We accept credit/debit cards and bank transfers.",
        minimum: "There's no minimum order amount, but orders over $50 qualify for free shipping within the Maldives.",
        bulk: "Yes, we offer bulk discounts for orders over $200. Contact us directly for corporate or restaurant bulk orders.",
        cancel: "You can cancel an order within 24 hours of placing it if it hasn't been shipped yet. Please contact our support team to arrange cancellation."
    },
    shipping: {
        domestic: "We provide delivery within 2-3 business days for local orders within the Maldives.",
        international: "International shipping takes 7-14 days depending on the destination country.",
        cost: "Shipping costs vary based on your location and order weight. For domestic orders, standard shipping is $5 and free for orders above $50.",
        tracking: "Yes, you'll receive a tracking number via email once your order has been shipped.",
        countries: "We currently ship to most countries in Asia, Europe, North America, and Australia. Some restrictions may apply to certain locations."
    },
    returns: {
        policy: "We have a 14-day return policy for unopened products. If you're not satisfied with your purchase, please contact our customer service.",
        process: "To initiate a return, please email support@mubarakproducts.com with your order number and return reason.",
        refund: "Refunds are processed within 5-7 business days once we receive and verify the returned products.",
        damaged: "If you receive damaged products, please take photos and contact us within 48 hours of delivery. We'll arrange replacement or refund."
    },
    company: {
        about: "Mubarak Products is a family-owned business that has been creating authentic Maldivian food products since 2005. We pride ourselves on quality and tradition.",
        location: "Our production facility is located in Malé, Maldives, but we ship our products worldwide.",
        contact: "You can reach our support team at support@mubarakproducts.com or call us at +960 123-4567 during business hours (9AM-5PM GMT+5).",
        values: "We value authenticity, quality, sustainability, and customer satisfaction above all else."
    },
    recipes: {
        fish: "Our Traditional Fish Fry goes great with rice or bread. For a complete meal, try it with coconut rice and a side of fresh vegetables.",
        achcharu: "Premium Achcharu is perfect as a side dish with rice and curry, or as a condiment with grilled meats and seafood.",
        spice: "Try using our Dhivehi Spice Mix as a rub for grilled fish or chicken, or add it to soups and stews for an authentic Maldivian flavor."
    }
};

// Detect intent from user message
const detectIntent = (message) => {
    const lowercaseMessage = message.toLowerCase();

    // Product inquiries
    if (/product|offer|sell|item|catalog|menu|options/i.test(lowercaseMessage)) {
        if (/bestseller|popular|best|most/i.test(lowercaseMessage)) {
            return { category: 'products', intent: 'bestsellers' };
        } else if (/new|latest|recent/i.test(lowercaseMessage)) {
            return { category: 'products', intent: 'new' };
        } else if (/organic|natural|preservative|chemical/i.test(lowercaseMessage)) {
            return { category: 'products', intent: 'organic' };
        } else if (/vegetarian|vegan|meat|animal/i.test(lowercaseMessage)) {
            return { category: 'products', intent: 'vegetarian' };
        } else {
            return { category: 'products', intent: 'general' };
        }
    }

    // Specific product queries
    else if (/fish|fry/i.test(lowercaseMessage)) {
        return { category: 'product', intent: 'fish_fry', productId: 1 };
    }
    else if (/achcharu|pickle/i.test(lowercaseMessage)) {
        return { category: 'product', intent: 'achcharu', productId: 2 };
    }
    else if (/spice|mix/i.test(lowercaseMessage)) {
        return { category: 'product', intent: 'spice_mix', productId: 3 };
    }
    else if (/chili|paste|hot/i.test(lowercaseMessage)) {
        return { category: 'product', intent: 'chili_paste', productId: 4 };
    }
    else if (/coconut|sambol/i.test(lowercaseMessage)) {
        return { category: 'product', intent: 'coconut_sambol', productId: 5 };
    }

    // Ordering inquiries
    else if (/order|buy|purchase|checkout|cart|payment/i.test(lowercaseMessage)) {
        if (/minimum|least/i.test(lowercaseMessage)) {
            return { category: 'ordering', intent: 'minimum' };
        } else if (/bulk|wholesale|large|restaurant/i.test(lowercaseMessage)) {
            return { category: 'ordering', intent: 'bulk' };
        } else if (/cancel|change|modify/i.test(lowercaseMessage)) {
            return { category: 'ordering', intent: 'cancel' };
        } else {
            return { category: 'ordering', intent: 'process' };
        }
    }

    // Shipping inquiries
    else if (/delivery|shipping|ship|arrive|when|how long|time/i.test(lowercaseMessage)) {
        if (/cost|price|fee|much/i.test(lowercaseMessage)) {
            return { category: 'shipping', intent: 'cost' };
        } else if (/track|where|status/i.test(lowercaseMessage)) {
            return { category: 'shipping', intent: 'tracking' };
        } else if (/country|countries|international|worldwide/i.test(lowercaseMessage)) {
            return { category: 'shipping', intent: 'countries' };
        } else if (/international|abroad|overseas/i.test(lowercaseMessage)) {
            return { category: 'shipping', intent: 'international' };
        } else {
            return { category: 'shipping', intent: 'domestic' };
        }
    }

    // Return policy inquiries
    else if (/return|refund|money back|policy/i.test(lowercaseMessage)) {
        if (/process|how|steps/i.test(lowercaseMessage)) {
            return { category: 'returns', intent: 'process' };
        } else if (/refund|money|back|credit/i.test(lowercaseMessage)) {
            return { category: 'returns', intent: 'refund' };
        } else if (/damage|broken|wrong/i.test(lowercaseMessage)) {
            return { category: 'returns', intent: 'damaged' };
        } else {
            return { category: 'returns', intent: 'policy' };
        }
    }

    // Company inquiries
    else if (/company|business|who|about|mubarak/i.test(lowercaseMessage)) {
        if (/location|where|address|facility/i.test(lowercaseMessage)) {
            return { category: 'company', intent: 'location' };
        } else if (/contact|email|phone|reach|support/i.test(lowercaseMessage)) {
            return { category: 'company', intent: 'contact' };
        } else if (/values|mission|ethics|responsible/i.test(lowercaseMessage)) {
            return { category: 'company', intent: 'values' };
        } else {
            return { category: 'company', intent: 'about' };
        }
    }

    // Recipe inquiries
    else if (/recipe|cook|prepare|use|dish|meal/i.test(lowercaseMessage)) {
        if (/fish|fry/i.test(lowercaseMessage)) {
            return { category: 'recipes', intent: 'fish' };
        } else if (/achcharu|pickle/i.test(lowercaseMessage)) {
            return { category: 'recipes', intent: 'achcharu' };
        } else if (/spice|mix/i.test(lowercaseMessage)) {
            return { category: 'recipes', intent: 'spice' };
        } else {
            return { category: 'recipes', intent: 'general' };
        }
    }

    // Greeting
    else if (/hi|hello|hey|greetings|good morning|good afternoon|good evening/i.test(lowercaseMessage)) {
        return { category: 'greeting', intent: 'hello' };
    }

    // Help
    else if (/help|assist|support/i.test(lowercaseMessage)) {
        return { category: 'help', intent: 'general' };
    }

    // Feedback/Thanks
    else if (/thank|thanks|good|great|awesome/i.test(lowercaseMessage)) {
        return { category: 'feedback', intent: 'thanks' };
    }

    // Fallback
    else {
        return { category: 'unknown', intent: 'fallback' };
    }
};

// Get AI response based on intent
const getResponse = (intent) => {
    // Product category responses
    if (intent.category === 'products') {
        return {
            text: knowledgeBase.products[intent.intent] || knowledgeBase.products.general,
            showProducts: true
        };
    }

    // Specific product responses
    else if (intent.category === 'product') {
        const product = productData.find(p => p.id === intent.productId);
        if (product) {
            return {
                text: `${product.name} (${product.popularity}): ${product.description} It contains ${product.ingredients} and costs ${product.price}.`,
                product: product
            };
        }
    }

    // Ordering responses
    else if (intent.category === 'ordering') {
        return {
            text: knowledgeBase.ordering[intent.intent] || knowledgeBase.ordering.process,
            showProductsLink: true
        };
    }

    // Shipping responses
    else if (intent.category === 'shipping') {
        return {
            text: knowledgeBase.shipping[intent.intent] || knowledgeBase.shipping.general
        };
    }

    // Return policy responses
    else if (intent.category === 'returns') {
        return {
            text: knowledgeBase.returns[intent.intent] || knowledgeBase.returns.policy
        };
    }

    // Company inquiries
    else if (intent.category === 'company') {
        if (intent.intent === 'contact') {
            return {
                text: knowledgeBase.company.contact,
                showContactLink: true
            };
        }
        return {
            text: knowledgeBase.company[intent.intent] || knowledgeBase.company.about
        };
    }

    // Recipe responses
    else if (intent.category === 'recipes') {
        return {
            text: knowledgeBase.recipes[intent.intent] || "We have many delicious recipes using our products. Would you like to know about a specific dish?"
        };
    }

    // Greeting
    else if (intent.category === 'greeting') {
        return {
            text: "Hello there! I'm your Mubarak Products assistant. How can I help you today? Feel free to ask about our products, delivery, or ordering process."
        };
    }

    // Help
    else if (intent.category === 'help') {
        return {
            text: "I'd be happy to help! You can ask me about our products, delivery times, how to place an order, or any other questions about Mubarak Products. What would you like to know?",
            showSuggestions: true
        };
    }

    // Feedback/Thanks
    else if (intent.category === 'feedback') {
        return {
            text: "You're welcome! I'm glad I could help. Is there anything else you'd like to know about our products or services?"
        };
    }

    // Fallback
    else {
        return {
            text: "I'm not sure I understand. Would you like information about our products, delivery, or ordering process?",
            showSuggestions: true
        };
    }
};

// Save chat history to local storage
const saveChatHistory = (messages) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mubarakChatHistory', JSON.stringify(messages));
    }
};

// Load chat history from local storage
const loadChatHistory = () => {
    if (typeof window !== 'undefined') {
        const history = localStorage.getItem('mubarakChatHistory');
        return history ? JSON.parse(history) : null;
    }
    return null;
};

// Clear chat history from local storage
const clearChatHistory = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('mubarakChatHistory');
    }
};

// Get relevant suggestions based on context
const getSuggestions = (context) => {
    const defaultSuggestions = [
        "What products do you offer?",
        "How long is delivery?",
        "How can I contact support?"
    ];

    if (context.category === 'product') {
        return [
            `What are the ingredients in ${productData.find(p => p.id === context.productId)?.name || 'this product'}?`,
            "How much is shipping?",
            "Do you have any promotions?"
        ];
    }

    if (context.category === 'products') {
        return [
            "What are your bestsellers?",
            "Do you use organic ingredients?",
            "Which products are vegetarian?"
        ];
    }

    if (context.category === 'ordering') {
        return [
            "Do you offer bulk discounts?",
            "What payment methods do you accept?",
            "What's your shipping policy?"
        ];
    }

    if (context.category === 'shipping') {
        return [
            "How can I track my order?",
            "Do you ship internationally?",
            "How much is shipping?"
        ];
    }

    if (context.category === 'returns') {
        return [
            "How do I initiate a return?",
            "How long does a refund take?",
            "What if I receive damaged goods?"
        ];
    }

    return defaultSuggestions;
};

// Get all products data
const getAllProducts = () => {
    return productData;
};

// Get product by ID
const getProductById = (id) => {
    return productData.find(product => product.id === id) || null;
};

export default {
    detectIntent,
    getResponse,
    getSuggestions,
    getAllProducts,
    getProductById,
    saveChatHistory,
    loadChatHistory,
    clearChatHistory
};
