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
                "voracious reader",
                "fitness enthusiast",
            ],
        },
        description: "I love to read, write, dabble in arts and photography, and push myself to the physical limit. I studied Politics and Government at Sciences Po Paris, and Computer Science and International Business at the University of British Columbia.",
        // Currently working on - rotating bubble
        currentlyWorkingOn: [
            "Skiing double blacks",
            "Software for readers",
            "Perfecting my backflip",
            "Self-learning snowboarding",
            "Running a half-marathon",
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
        { title: "My Friends", author: "Fredrik Backman", goodreadsUrl: "https://www.goodreads.com/book/show/217163697-my-friends", coverUrl: "images/book-covers/my-friends.png" },
        { title: "One Day, Everyone Will Have Always Been Against This", author: "Omar El Akkad", goodreadsUrl: "https://www.goodreads.com/book/show/213870084-one-day-everyone-will-have-always-been-against-this", coverUrl: "images/book-covers/one-day.png" },
        { title: "First They Killed My Father", author: "Loung Ung", goodreadsUrl: "https://www.goodreads.com/book/show/4373.First_They_Killed_My_Father", coverUrl: "images/book-covers/first-they-killed-my-father.png" },
        { title: "Exhalation", author: "Ted Chiang", goodreadsUrl: "https://www.goodreads.com/book/show/41160292-exhalation", coverUrl: "images/book-covers/exhalation.png" },
        { title: "Daughters of Shandong", author: "Eve J. Chung", goodreadsUrl: "https://www.goodreads.com/book/show/195888874-daughters-of-shandong", coverUrl: "images/book-covers/daughters-of-shandong.png" },
        { title: "Why Fish Don't Exist", author: "Lulu Miller", goodreadsUrl: "https://www.goodreads.com/book/show/50887097-why-fish-don-t-exist", coverUrl: "images/book-covers/why-fish-dont-exist.png" },
        { title: "We Wish to Inform You That Tomorrow We Will Be Killed with Our Families", author: "Philip Gourevitch", goodreadsUrl: "https://www.goodreads.com/book/show/11472.We_Wish_to_Inform_You_That_Tomorrow_We_Will_Be_Killed_with_Our_Families", coverUrl: "images/book-covers/we-wish-to-inform-you.png" },
        { title: "Out of the Gobi", author: "Weijian Shan", goodreadsUrl: "https://www.goodreads.com/book/show/39873868-out-of-the-gobi", coverUrl: "images/book-covers/out-of-the-gobi.png" },
        { title: "Beartown", author: "Fredrik Backman", goodreadsUrl: "https://www.goodreads.com/book/show/33413128-beartown", coverUrl: "images/book-covers/beartown.png" },
        { title: "Being Mortal", author: "Atul Gawande", goodreadsUrl: "https://www.goodreads.com/book/show/20696006-being-mortal", coverUrl: "images/book-covers/being-mortal.png" },
        { title: "Know My Name", author: "Chanel Miller", goodreadsUrl: "https://www.goodreads.com/book/show/50196744-know-my-name", coverUrl: "images/book-covers/know-my-name.png" },
        { title: "When Breath Becomes Air", author: "Paul Kalanithi", goodreadsUrl: "https://www.goodreads.com/book/show/25899336-when-breath-becomes-air", coverUrl: "images/book-covers/when-breath-becomes-air.png" },
        { title: "The Rape of Nanking", author: "Iris Chang", goodreadsUrl: "https://www.goodreads.com/book/show/56109610-the-rape-of-nanking", coverUrl: "images/book-covers/the-rape-of-nanking.png" },
        { title: "The Remains of the Day", author: "Kazuo Ishiguro", goodreadsUrl: "https://www.goodreads.com/book/show/28921.The_Remains_of_the_Day", coverUrl: "images/book-covers/the-remains-of-the-day.png" },
        { title: "A Room of One's Own", author: "Virginia Woolf", goodreadsUrl: "https://www.goodreads.com/book/show/18521.A_Room_of_One_s_Own", coverUrl: "images/book-covers/a-room-of-ones-own.png" },
        { title: "A Gentleman in Moscow", author: "Amor Towles", goodreadsUrl: "https://www.goodreads.com/book/show/34066798-a-gentleman-in-moscow", coverUrl: "images/book-covers/a-gentleman-in-moscow.png" },
        { title: "The Anthropocene Reviewed", author: "John Green", goodreadsUrl: "https://www.goodreads.com/book/show/55922803-the-anthropocene-reviewed", coverUrl: "images/book-covers/the-anthropocene-reviewed.png" },
        { title: "I'm Glad My Mom Died", author: "Jennette McCurdy", goodreadsUrl: "https://www.goodreads.com/book/show/59366244-i-m-glad-my-mom-died", coverUrl: "images/book-covers/im-glad-my-mom-died.png" },
        { title: "Rebecca", author: "Daphne du Maurier", goodreadsUrl: "https://www.goodreads.com/book/show/17899948-rebecca", coverUrl: "images/book-covers/rebecca.png" },
        { title: "Bad Blood", author: "John Carreyrou", goodreadsUrl: "https://www.goodreads.com/book/show/37976541-bad-blood", coverUrl: "images/book-covers/bad-blood.png" },
        { title: "A Man Called Ove", author: "Fredrik Backman", goodreadsUrl: "https://www.goodreads.com/book/show/18774964-a-man-called-ove", coverUrl: "images/book-covers/a-man-called-ove.png" },
        { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", goodreadsUrl: "https://www.goodreads.com/book/show/863928", coverUrl: "images/book-covers/le-petit-prince.png" },
        { title: "The Lion, the Witch and the Wardrobe", author: "C.S. Lewis", goodreadsUrl: "https://www.goodreads.com/book/show/1045154.The_Lion_the_Witch_and_the_Wardrobe", coverUrl: "images/book-covers/the-lion-the-witch.png" },
        { title: "Flowers for Algernon", author: "Daniel Keyes", goodreadsUrl: "https://www.goodreads.com/book/show/18373.Flowers_for_Algernon", coverUrl: "images/book-covers/flowers-for-algernon.png" }
    ],

    // Photo Trips
    // Photos loaded at runtime from {folder}/photos.json (generated by build-photos.sh)
    photoTrips: [
        // 2026
        { slug: "south_korea", title: "South Korea", year: "2026", folder: "images/2026_skorea", cover: "DSC01006.JPG" },
        { slug: "china", title: "China", year: "2026", folder: "images/2026_china", cover: "DSC08391.JPG" },
        { slug: "japan", title: "Japan", year: "2026", folder: "images/2026_japan", cover: "DSC08808.JPG" },

        // 2025
        { slug: "turkey", title: "Turkey", year: "2025", folder: "images/2025_turkey", cover: "DSC06397.JPG" },
        { slug: "canada", title: "Canada", year: "2025", folder: "images/2025_canada", cover: "DSC03704.JPG" },
        { slug: "dc", title: "Washington, DC", year: "2025", folder: "images/2025_dc", cover: "DSC03411.JPG" },
        
        // Peeps
        { slug: "peeps", title: "Peeps", year: "202X", folder: "images/202X_peeps", cover: "DSC03195.JPG" },
    ],

    // Navigation Buttons
    navLinks: [
        { href: "/", label: "Home", icon: "home" },
        { href: "/writing", label: "Writing", icon: "file-text" },
        { href: "/photography", label: "Photography", icon: "camera" }
    ]
};
