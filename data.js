/**
 * Portfolio Data
 * All content data for the portfolio site
 */

const portfolioData = {
    personal: {
        name: "Alice Li",
        subtitle: "Engineer + Storyteller",
        location: "NYC",
        tagline: "software + stories",
        email: "alicehli999 [at] gmail.com",
        linkedin: "https://www.linkedin.com/in/alicehli/",
        github: "https://github.com/alicehli",
        goodreads: "https://www.goodreads.com/alicehl",
        profilePhoto: "images/alice.jpeg"
    },

    // Hero Section
    hero: {
        subtitle: "Welcome to my little corner of the internet C:",
        title: {
            text: "My little",
            accent1: { text: "gallery", color: "green" },
            accent2: { text: "notebook", color: "pink" }
        },
        // Typewriter rotating text
        typewriter: {
            prefix: "Hello, I'm Alice! I'm a ",
            words: [
                "software engineer",
                "quantitative developer",
                "Canadian living in NYC",
            ],
        },
        description: "I love to read, write, and dabble in arts and photography. I studied Politics and Government at Sciences Po Paris, and Computer Science and International Business at the University of British Columbia.",
        // Currently working on - rotating bubble
        currentlyWorkingOn: [
            "Skiing double blacks",
            "Software for readers",
            "Perfecting my backflip",
            "Learning to snowboard"
        ]
    },

    // Hero Photo Grid
    heroPhotos: [
        {
            src: "images/1_balloon.jpg",
            alt: "Cappadocia",
            title: "Cappadocia, Turkey",
            meta: "2025",
            description: "A hot air balloon ride during sunrise over the stunning landscapes of Cappadocia!"
        },
        {
            src: "images/2_dresden.jpg",
            alt: "Dresden",
            title: "Dresden, Germany",
            meta: "2025",
            description: "A weekend trip from Berlin to explore some beautiful baroque architecture."
        },
        {
            src: "images/3_dc.jpg",
            alt: "Washington, DC",
            title: "Washington, DC",
            meta: "2025",
            description: "The famous cherry blossoms!"
        },
        {
            src: "images/4_vancouver.jpg",
            alt: "Vancouver, BC",
            title: "Vancouver, BC",
            meta: "2025",
            description: "Cityscape, mountains, the ocean, and incredible food. Home sweet home!"
        }
    ],


    // Favorite Books List (with Goodreads URLs)
    favoriteBooks: [
        { title: "My Friends", author: "Fredrik Backman", goodreadsUrl: "https://www.goodreads.com/book/show/217163697-my-friends" },
        { title: "One Day, Everyone Will Have Always Been Against This", author: "Omar El Akkad", goodreadsUrl: "https://www.goodreads.com/book/show/213870084-one-day-everyone-will-have-always-been-against-this" },
        { title: "First They Killed My Father", author: "Loung Ung", goodreadsUrl: "https://www.goodreads.com/book/show/4373.First_They_Killed_My_Father" },
        { title: "Exhalation", author: "Ted Chiang", goodreadsUrl: "https://www.goodreads.com/book/show/41160292-exhalation" },
        { title: "Daughters of Shandong", author: "Eve J. Chung", goodreadsUrl: "https://www.goodreads.com/book/show/195888874-daughters-of-shandong" },
        { title: "Why Fish Don't Exist", author: "Lulu Miller", goodreadsUrl: "https://www.goodreads.com/book/show/50887097-why-fish-don-t-exist" },
        { title: "We Wish to Inform You That Tomorrow We Will Be Killed with Our Families", author: "Philip Gourevitch", goodreadsUrl: "https://www.goodreads.com/book/show/11472.We_Wish_to_Inform_You_That_Tomorrow_We_Will_Be_Killed_with_Our_Families" },
        { title: "Out of the Gobi", author: "Weijian Shan", goodreadsUrl: "https://www.goodreads.com/book/show/39873868-out-of-the-gobi" },
        { title: "Beartown", author: "Fredrik Backman", goodreadsUrl: "https://www.goodreads.com/book/show/33413128-beartown" },
        { title: "Being Mortal", author: "Atul Gawande", goodreadsUrl: "https://www.goodreads.com/book/show/20696006-being-mortal" },
        { title: "Know My Name", author: "Chanel Miller", goodreadsUrl: "https://www.goodreads.com/book/show/50196744-know-my-name" },
        { title: "When Breath Becomes Air", author: "Paul Kalanithi", goodreadsUrl: "https://www.goodreads.com/book/show/25899336-when-breath-becomes-air" },
        { title: "The Rape of Nanking", author: "Iris Chang", goodreadsUrl: "https://www.goodreads.com/book/show/56109610-the-rape-of-nanking" },
        { title: "The Remains of the Day", author: "Kazuo Ishiguro", goodreadsUrl: "https://www.goodreads.com/book/show/28921.The_Remains_of_the_Day" },
        { title: "A Room of One's Own", author: "Virginia Woolf", goodreadsUrl: "https://www.goodreads.com/book/show/18521.A_Room_of_One_s_Own" },
        { title: "A Gentleman in Moscow", author: "Amor Towles", goodreadsUrl: "https://www.goodreads.com/book/show/34066798-a-gentleman-in-moscow" },
        { title: "The Anthropocene Reviewed", author: "John Green", goodreadsUrl: "https://www.goodreads.com/book/show/55922803-the-anthropocene-reviewed" },
        { title: "I'm Glad My Mom Died", author: "Jennette McCurdy", goodreadsUrl: "https://www.goodreads.com/book/show/59366244-i-m-glad-my-mom-died" },
        { title: "Rebecca", author: "Daphne du Maurier", goodreadsUrl: "https://www.goodreads.com/book/show/17899948-rebecca" },
        { title: "Bad Blood", author: "John Carreyrou", goodreadsUrl: "https://www.goodreads.com/book/show/37976541-bad-blood" },
        { title: "A Man Called Ove", author: "Fredrik Backman", goodreadsUrl: "https://www.goodreads.com/book/show/18774964-a-man-called-ove" },
        { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", goodreadsUrl: "https://www.goodreads.com/book/show/863928" },
        { title: "The Lion, the Witch and the Wardrobe", author: "C.S. Lewis", goodreadsUrl: "https://www.goodreads.com/book/show/1045154.The_Lion_the_Witch_and_the_Wardrobe" },
        { title: "Flowers for Algernon", author: "Daniel Keyes", goodreadsUrl: "https://www.goodreads.com/book/show/18373.Flowers_for_Algernon" }
    ],

    // Navigation Buttons
    navLinks: [
        { href: "index.html", label: "Home", icon: "home" },
        { href: "gallery.html", label: "Photo", icon: "camera" },
        { href: "writing.html", label: "Writing", icon: "file-text" },
        { href: "index.html#reading", label: "Reading", icon: "book" },
        { href: "index.html#contact", label: "Contact", icon: "mail" }
    ]
};
