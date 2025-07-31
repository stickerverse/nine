// Sticker-themed carousel data
const stickerData = [
    {
        place: 'Premium Collection',
        title: 'CUSTOM',
        title2: 'STICKERS',
        description: 'Transform your ideas into stunning, high-quality custom stickers. Perfect for branding, personal expression, or promotional campaigns. Our premium vinyl ensures durability and vibrant colors that last.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
        place: 'Die-Cut Excellence',
        title: 'SHAPED',
        title2: 'PERFECTION',
        description: 'Die-cut stickers follow the exact outline of your design, creating professional-looking results with no background. Ideal for logos, characters, and complex shapes that demand precision.',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2039&q=80'
    },
    {
        place: 'Holographic Magic',
        title: 'SHIMMER',
        title2: 'SHINE',
        description: 'Make your designs pop with holographic stickers that catch the light and change colors from different angles. Perfect for adding that extra wow factor to your brand or personal projects.',
        image: 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
        place: 'Weatherproof Quality',
        title: 'OUTDOOR',
        title2: 'DURABILITY',
        description: 'Built to withstand the elements, our weatherproof stickers maintain their vibrant appearance through rain, sun, and snow. Perfect for outdoor applications, vehicles, and equipment.',
        image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
    },
    {
        place: 'Business Branding',
        title: 'BRAND',
        title2: 'IDENTITY',
        description: 'Elevate your business presence with professional custom stickers. From logo stickers to promotional materials, create consistent branding that makes a lasting impression on your customers.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
        place: 'Creative Expression',
        title: 'ARTISTIC',
        title2: 'FREEDOM',
        description: 'Unleash your creativity with unlimited design possibilities. From artistic illustrations to photographic prints, turn any image into a professional-quality sticker that tells your story.',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80'
    }
];

// Utility functions
const _ = (id) => document.getElementById(id);
const range = (n) => Array(n).fill(0).map((i, j) => i + j);

// Generate HTML content
function generateCarouselHTML() {
    const cards = stickerData.map((item, index) => 
        `<div class="card" id="card${index}" style="background-image:url(${item.image})"></div>`
    ).join('');

    const cardContents = stickerData.map((item, index) => 
        `<div class="card-content" id="card-content-${index}">
            <div class="content-start"></div>
            <div class="content-place">${item.place}</div>
            <div class="content-title-1">${item.title}</div>
            <div class="content-title-2">${item.title2}</div>
        </div>`
    ).join('');

    const slideNumbers = stickerData.map((_, index) => 
        `<div class="item" id="slide-item-${index}">${index + 1}</div>`
    ).join('');

    return { cards, cardContents, slideNumbers };
}

// Animation helper
function animate(target, duration, properties) {
    return new Promise((resolve) => {
        gsap.to(target, {
            ...properties,
            duration: duration,
            onComplete: resolve,
        });
    });
}

// Carousel class
class StickerCarousel {
    constructor() {
        this.order = [0, 1, 2, 3, 4, 5];
        this.detailsEven = true;
        this.clicks = 0;
        this.offsetTop = 200;
        this.offsetLeft = 700;
        this.cardWidth = 200;
        this.cardHeight = 300;
        this.gap = 40;
        this.numberSize = 50;
        this.ease = "sine.inOut";
        
        this.init();
    }

    getCard(index) {
        return `#card${index}`;
    }

    getCardContent(index) {
        return `#card-content-${index}`;
    }

    getSliderItem(index) {
        return `#slide-item-${index}`;
    }

    init() {
        // Generate and insert HTML
        const { cards, cardContents, slideNumbers } = generateCarouselHTML();
        _('carousel-demo').innerHTML = cards + cardContents;
        _('slide-numbers').innerHTML = slideNumbers;

        // Add event listeners
        this.setupEventListeners();

        // Initialize carousel
        this.setupCarousel();
        this.startCarousel();
    }

    setupEventListeners() {
        document.querySelector('.arrow-left').addEventListener('click', () => this.handlePagination('left'));
        document.querySelector('.arrow-right').addEventListener('click', () => this.handlePagination('right'));
    }

    handlePagination(direction) {
        this.clicks += 1;
        this.step();
    }

    setupCarousel() {
        const [active, ...rest] = this.order;
        const detailsActive = this.detailsEven ? "#details-even" : "#details-odd";
        const detailsInactive = this.detailsEven ? "#details-odd" : "#details-even";
        const { innerHeight: height, innerWidth: width } = window;
        
        this.offsetTop = height - 430;
        this.offsetLeft = width - 830;

        // Set initial positions
        gsap.set("#pagination", {
            top: this.offsetTop + 330,
            left: this.offsetLeft,
            y: 200,
            opacity: 0,
            zIndex: 60,
        });

        gsap.set(".hero-nav", { y: -200, opacity: 0 });

        gsap.set(this.getCard(active), {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        });

        gsap.set(this.getCardContent(active), { x: 0, y: 0, opacity: 0 });
        gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
        gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
        
        // Set inactive details positions
        gsap.set(`${detailsInactive} .text`, { y: 100 });
        gsap.set(`${detailsInactive} .title-1`, { y: 100 });
        gsap.set(`${detailsInactive} .title-2`, { y: 100 });
        gsap.set(`${detailsInactive} .desc`, { y: 50 });
        gsap.set(`${detailsInactive} .cta`, { y: 60 });

        gsap.set(".progress-sub-foreground", {
            width: 500 * (1 / this.order.length) * (active + 1),
        });

        // Position other cards
        rest.forEach((i, index) => {
            gsap.set(this.getCard(i), {
                x: this.offsetLeft + 400 + index * (this.cardWidth + this.gap),
                y: this.offsetTop,
                width: this.cardWidth,
                height: this.cardHeight,
                zIndex: 30,
                borderRadius: 10,
            });
            
            gsap.set(this.getCardContent(i), {
                x: this.offsetLeft + 400 + index * (this.cardWidth + this.gap),
                zIndex: 40,
                y: this.offsetTop + this.cardHeight - 100,
            });
            
            gsap.set(this.getSliderItem(i), { x: (index + 1) * this.numberSize });
        });

        gsap.set(".indicator", { x: -window.innerWidth });
    }

    startCarousel() {
        const startDelay = 0.6;
        const [active, ...rest] = this.order;
        const detailsActive = this.detailsEven ? "#details-even" : "#details-odd";

        // Animate cover
        gsap.to(".cover", {
            x: window.innerWidth + 400,
            delay: 0.5,
            ease: this.ease,
            onComplete: () => {
                setTimeout(() => {
                    this.loop();
                }, 500);
            },
        });

        // Animate cards into position
        rest.forEach((i, index) => {
            gsap.to(this.getCard(i), {
                x: this.offsetLeft + index * (this.cardWidth + this.gap),
                zIndex: 30,
                delay: startDelay + 0.05 * index,
                ease: this.ease,
            });
            
            gsap.to(this.getCardContent(i), {
                x: this.offsetLeft + index * (this.cardWidth + this.gap),
                zIndex: 40,
                delay: startDelay + 0.05 * index,
                ease: this.ease,
            });
        });

        // Animate UI elements
        gsap.to("#pagination", { y: 0, opacity: 1, ease: this.ease, delay: startDelay });
        gsap.to(".hero-nav", { y: 0, opacity: 1, ease: this.ease, delay: startDelay });
        gsap.to(detailsActive, { opacity: 1, x: 0, ease: this.ease, delay: startDelay });
    }

    step() {
        return new Promise((resolve) => {
            this.order.push(this.order.shift());
            this.detailsEven = !this.detailsEven;

            const detailsActive = this.detailsEven ? "#details-even" : "#details-odd";
            const detailsInactive = this.detailsEven ? "#details-odd" : "#details-even";

            // Update content
            const currentData = stickerData[this.order[0]];
            document.querySelector(`${detailsActive} .place-box .text`).textContent = currentData.place;
            document.querySelector(`${detailsActive} .title-1`).textContent = currentData.title;
            document.querySelector(`${detailsActive} .title-2`).textContent = currentData.title2;
            document.querySelector(`${detailsActive} .desc`).textContent = currentData.description;

            // Animate details
            gsap.set(detailsActive, { zIndex: 22 });
            gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease: this.ease });
            gsap.to(`${detailsActive} .text`, { y: 0, delay: 0.1, duration: 0.7, ease: this.ease });
            gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.15, duration: 0.7, ease: this.ease });
            gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.15, duration: 0.7, ease: this.ease });
            gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.3, duration: 0.4, ease: this.ease });
            gsap.to(`${detailsActive} .cta`, {
                y: 0,
                delay: 0.35,
                duration: 0.4,
                onComplete: resolve,
                ease: this.ease,
            });

            gsap.set(detailsInactive, { zIndex: 12 });

            const [active, ...rest] = this.order;
            const prv = rest[rest.length - 1];

            // Animate cards
            gsap.set(this.getCard(prv), { zIndex: 10 });
            gsap.set(this.getCard(active), { zIndex: 20 });
            gsap.to(this.getCard(prv), { scale: 1.5, ease: this.ease });

            gsap.to(this.getCardContent(active), {
                y: this.offsetTop + this.cardHeight - 10,
                opacity: 0,
                duration: 0.3,
                ease: this.ease,
            });

            gsap.to(this.getSliderItem(active), { x: 0, ease: this.ease });
            gsap.to(this.getSliderItem(prv), { x: -this.numberSize, ease: this.ease });
            gsap.to(".progress-sub-foreground", {
                width: 500 * (1 / this.order.length) * (active + 1),
                ease: this.ease,
            });

            gsap.to(this.getCard(active), {
                x: 0,
                y: 0,
                ease: this.ease,
                width: window.innerWidth,
                height: window.innerHeight,
                borderRadius: 0,
                onComplete: () => {
                    const xNew = this.offsetLeft + (rest.length - 1) * (this.cardWidth + this.gap);
                    
                    // Reset previous card
                    gsap.set(this.getCard(prv), {
                        x: xNew,
                        y: this.offsetTop,
                        width: this.cardWidth,
                        height: this.cardHeight,
                        zIndex: 30,
                        borderRadius: 10,
                        scale: 1,
                    });

                    gsap.set(this.getCardContent(prv), {
                        x: xNew,
                        y: this.offsetTop + this.cardHeight - 100,
                        opacity: 1,
                        zIndex: 40,
                    });

                    gsap.set(this.getSliderItem(prv), { x: rest.length * this.numberSize });

                    // Reset inactive details
                    gsap.set(detailsInactive, { opacity: 0 });
                    gsap.set(`${detailsInactive} .text`, { y: 100 });
                    gsap.set(`${detailsInactive} .title-1`, { y: 100 });
                    gsap.set(`${detailsInactive} .title-2`, { y: 100 });
                    gsap.set(`${detailsInactive} .desc`, { y: 50 });
                    gsap.set(`${detailsInactive} .cta`, { y: 60 });

                    this.clicks -= 1;
                    if (this.clicks > 0) {
                        this.step();
                    }
                },
            });

            // Animate other cards
            rest.forEach((i, index) => {
                if (i !== prv) {
                    const xNew = this.offsetLeft + index * (this.cardWidth + this.gap);
                    gsap.set(this.getCard(i), { zIndex: 30 });
                    gsap.to(this.getCard(i), {
                        x: xNew,
                        y: this.offsetTop,
                        width: this.cardWidth,
                        height: this.cardHeight,
                        ease: this.ease,
                        delay: 0.1 * (index + 1),
                    });

                    gsap.to(this.getCardContent(i), {
                        x: xNew,
                        y: this.offsetTop + this.cardHeight - 100,
                        opacity: 1,
                        zIndex: 40,
                        ease: this.ease,
                        delay: 0.1 * (index + 1),
                    });
                    
                    gsap.to(this.getSliderItem(i), { x: (index + 1) * this.numberSize, ease: this.ease });
                }
            });
        });
    }

    async loop() {
        await animate(".indicator", 2, { x: 0 });
        await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
        gsap.set(".indicator", { x: -window.innerWidth });
        await this.step();
        this.loop();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP is required for the carousel to work');
        return;
    }
    
    // Initialize carousel
    new StickerCarousel();
});