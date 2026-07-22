document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Sticky header on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // ── Testimonials Slider ──────────────────────────────────────────────────
    const track = document.getElementById('testimonials-track');
    const btnPrev = document.getElementById('testimonial-prev');
    const btnNext = document.getElementById('testimonial-next');
    const dotsWrap = document.getElementById('testimonial-dots');

    if (track && btnPrev && btnNext && dotsWrap) {
        const cards = Array.from(track.querySelectorAll('.testimonial-card'));
        const total = cards.length;
        let currentIndex = 0;
        let autoTimer = null;

        // How many cards are visible at once?
        function getVisible() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        // Build dots
        function buildDots() {
            dotsWrap.innerHTML = '';
            const visible = getVisible();
            const numGroups = Math.ceil(total / visible);
            for (let i = 0; i < numGroups; i++) {
                const dot = document.createElement('button');
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Nhóm ${i + 1}`);
                dot.addEventListener('click', () => goTo(i * visible));
                dotsWrap.appendChild(dot);
            }
        }

        function updateDots() {
            const visible = getVisible();
            const groupIdx = Math.floor(currentIndex / visible);
            const dots = dotsWrap.querySelectorAll('.slider-dot');
            dots.forEach((d, i) => d.classList.toggle('active', i === groupIdx));
        }

        function goTo(index) {
            const visible = getVisible();
            const maxIndex = total - visible;
            currentIndex = Math.max(0, Math.min(index, maxIndex));

            // Card width + gap
            const cardEl = cards[0];
            const gap = parseFloat(getComputedStyle(track).gap) || 32;
            const offset = currentIndex * (cardEl.offsetWidth + gap);

            track.style.transform = `translateX(-${offset}px)`;

            btnPrev.disabled = currentIndex === 0;
            btnNext.disabled = currentIndex >= maxIndex;
            updateDots();
        }

        function next() { goTo(currentIndex + getVisible()); }
        function prev() { goTo(currentIndex - getVisible()); }

        function startAuto() {
            autoTimer = setInterval(() => {
                const visible = getVisible();
                const maxIndex = total - visible;
                if (currentIndex >= maxIndex) {
                    goTo(0);
                } else {
                    next();
                }
            }, 5000);
        }

        function resetAuto() {
            clearInterval(autoTimer);
            startAuto();
        }

        btnNext.addEventListener('click', () => { next(); resetAuto(); });
        btnPrev.addEventListener('click', () => { prev(); resetAuto(); });

        // Touch / swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
        }, { passive: true });

        // Rebuild on resize
        window.addEventListener('resize', () => {
            buildDots();
            goTo(0);
        });

        buildDots();
        goTo(0);
        startAuto();
    }

    // ── Lightbox & Phân Trang cho "Ảnh Thực Tế" ──────────────────────────────
    const projectsList = [
        {
            key: 'solar-dan-dung',
            title: 'HỆ THỐNG ĐIỆN MẶT TRỜI DÂN DỤNG - BIỆT THỰ HÀ ĐÔNG',
            coverUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Lắp đặt tấm pin mặt trời áp mái công suất 15kWp'
                },
                {
                    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Sử dụng tấm pin mono tinh thể cao cấp đạt hiệu suất tối đa'
                },
                {
                    url: 'https://images.unsplash.com/photo-1620038650424-85e6517e290e?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Hệ thống inverter và tủ bảo vệ AC/DC thông minh trong nhà'
                }
            ]
        },
        {
            key: 'solar-cong-nghiep',
            title: 'ĐIỆN MẶT TRỜI ÁP MÁI NHÀ XƯỞNG - KCN BÌNH DƯƠNG',
            coverUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Hệ thống điện mặt trời công nghiệp quy mô 1.2 MWp'
                },
                {
                    url: 'https://images.unsplash.com/photo-1548613053-220a29df10dc?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Hàng ngàn tấm pin mặt trời được lắp đặt song song chuẩn kỹ thuật'
                },
                {
                    url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Góp phần chuyển đổi xanh và giảm chi phí vận hành cho nhà máy'
                }
            ]
        },
        {
            key: 'dien-cong-nghiep',
            title: 'HỆ THỐNG TỦ ĐIỆN VÀ PHÂN PHỐI NGUỒN - NHÀ MÁY THÉP',
            coverUrl: 'images/tu-dien-phan-phoi-cho-nha-xuong-san-xuat.jpg?auto=format&fit=crop&w=800&q=80',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Lắp đặt tủ điện phân phối chính MSB và thang máng cáp'
                },
                {
                    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Hệ thống điều khiển lập trình PLC tự động hóa dây chuyền'
                },
                {
                    url: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Đảm bảo tiêu chuẩn an toàn chống rò rỉ điện tuyệt đối'
                }
            ]
        },
        {
            key: 'hvac-chiller',
            title: 'HỆ THỐNG ĐIỀU HÒA TRUNG TÂM CHILLER - TOÀ NHÀ AN KHÁNH',
            coverUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Hệ thống giải nhiệt nước Chiller lắp đặt trên tầng mái tòa nhà'
                },
                {
                    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Đường ống gió và xử lý không khí trung tâm AHU vận hành êm ái'
                },
                {
                    url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Đảm bảo thông thoáng gió và lọc khí sạch toàn bộ văn phòng'
                }
            ]
        },
        {
            key: 'co-khi-nha-xuong',
            title: 'GIA CÔNG & LẮP ĐẶT KẾT CẤU THÉP KHUNG NHÀ KHO',
            coverUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Lắp đặt khung kèo kết cấu thép chịu lực cao cấp cho nhà kho công nghiệp'
                },
                {
                    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Gia công hàn cơ khí chi tiết, đạt độ bền cơ học cao nhất'
                },
                {
                    url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Lắp đặt đường dẫn ống dẫn khí nén và phụ trợ công nghiệp'
                }
            ]
        },
        {
            key: 'thang-may-nang-ha',
            title: 'LẮP ĐẶT THANG MÁY GIA ĐÌNH & BÀN NÂNG THỦY LỰC',
            coverUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Thang máy kính gia đình sang trọng sử dụng công nghệ thủy lực mượt mà'
                },
                {
                    url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Lắp đặt sàn nâng tự động Dock Leveler tại kho xuất nhập hàng'
                },
                {
                    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
                    desc: 'Bàn nâng chữ X thủy lực hỗ trợ nâng hạ pallet hàng hóa tự động'
                }
            ]
        }
    ];

    const PROJECTS_PER_PAGE = 6;
    let currentPaginationPage = 1;

    const gridContainer = document.getElementById('real-photos-grid');
    const paginationContainer = document.getElementById('real-photos-pagination');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-project-title');
    const lightboxDesc = document.getElementById('lightbox-image-desc');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxThumbs = document.getElementById('lightbox-thumbnails');
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;

    let currentProject = null;
    let currentImgIndex = 0;
    let openLightbox = () => { };

    // Render Grid and Pagination
    function renderProjectsGrid() {
        if (!gridContainer) return;

        gridContainer.innerHTML = '';

        const startIndex = (currentPaginationPage - 1) * PROJECTS_PER_PAGE;
        const endIndex = startIndex + PROJECTS_PER_PAGE;
        const pageProjects = projectsList.slice(startIndex, endIndex);

        pageProjects.forEach((proj, index) => {
            const card = document.createElement('div');
            card.className = 'real-photo-card reveal active';
            card.style.transitionDelay = `${(index % 3) * 0.1}s`;
            card.setAttribute('data-project', proj.key);

            card.innerHTML = `
                <div class="real-photo-img-wrap">
                    <img src="${proj.coverUrl}" alt="${proj.title}" loading="lazy">
                    <div class="real-photo-brand">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                        <span>ANVITECH M&E</span>
                    </div>
                </div>
                <div class="real-photo-info">
                    <h3>${proj.title}</h3>
                </div>
            `;

            card.addEventListener('click', () => {
                openLightbox(proj.key);
            });

            gridContainer.appendChild(card);
        });

        renderPaginationControls();
    }

    function renderPaginationControls() {
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(projectsList.length / PROJECTS_PER_PAGE);
        if (totalPages <= 1) return;

        // Prev Button
        const prevPageBtn = document.createElement('button');
        prevPageBtn.className = 'real-photos-pagination-btn';
        prevPageBtn.innerHTML = '&#8249;';
        prevPageBtn.disabled = currentPaginationPage === 1;
        prevPageBtn.addEventListener('click', () => {
            if (currentPaginationPage > 1) {
                currentPaginationPage--;
                renderProjectsGrid();
                scrollToSection();
            }
        });
        paginationContainer.appendChild(prevPageBtn);

        // Numeric Buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageNumBtn = document.createElement('button');
            pageNumBtn.className = `real-photos-pagination-btn ${i === currentPaginationPage ? 'active' : ''}`;
            pageNumBtn.textContent = i;
            pageNumBtn.addEventListener('click', () => {
                if (currentPaginationPage !== i) {
                    currentPaginationPage = i;
                    renderProjectsGrid();
                    scrollToSection();
                }
            });
            paginationContainer.appendChild(pageNumBtn);
        }

        // Next Button
        const nextPageBtn = document.createElement('button');
        nextPageBtn.className = 'real-photos-pagination-btn';
        nextPageBtn.innerHTML = '&#8250;';
        nextPageBtn.disabled = currentPaginationPage === totalPages;
        nextPageBtn.addEventListener('click', () => {
            if (currentPaginationPage < totalPages) {
                currentPaginationPage++;
                renderProjectsGrid();
                scrollToSection();
            }
        });
        paginationContainer.appendChild(nextPageBtn);
    }

    function scrollToSection() {
        const section = document.getElementById('real-photos');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    if (lightbox && lightboxImg && lightboxTitle && lightboxDesc && lightboxCounter && lightboxThumbs) {
        // Open Lightbox
        openLightbox = (projectKey) => {
            currentProject = projectsList.find(p => p.key === projectKey);
            if (!currentProject) return;

            currentImgIndex = 0;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Build Thumbnails
            lightboxThumbs.innerHTML = '';
            currentProject.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img.url.replace('w=1200', 'w=150');
                thumb.alt = `Thumb ${index + 1}`;
                thumb.addEventListener('click', () => {
                    currentImgIndex = index;
                    updateLightbox();
                });
                lightboxThumbs.appendChild(thumb);
            });

            updateLightbox();
        };

        // Update content in lightbox
        const updateLightbox = () => {
            const imgData = currentProject.images[currentImgIndex];
            lightboxImg.src = imgData.url;
            lightboxTitle.textContent = currentProject.title;
            lightboxDesc.textContent = imgData.desc;
            lightboxCounter.textContent = `${currentImgIndex + 1} / ${currentProject.images.length}`;

            // Update active thumbnail
            const thumbs = lightboxThumbs.querySelectorAll('img');
            thumbs.forEach((thumb, idx) => {
                thumb.classList.toggle('active', idx === currentImgIndex);
            });

            // Auto-scroll active thumb into view if overflowing
            const activeThumb = thumbs[currentImgIndex];
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const prevImg = () => {
            currentImgIndex = (currentImgIndex - 1 + currentProject.images.length) % currentProject.images.length;
            updateLightbox();
        };

        const nextImg = () => {
            currentImgIndex = (currentImgIndex + 1) % currentProject.images.length;
            updateLightbox();
        };

        // Event listeners for lightbox controls
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', prevImg);
        nextBtn.addEventListener('click', nextImg);

        // Close when clicking outside the main image content
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });

        // Key press events
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImg();
            if (e.key === 'ArrowRight') nextImg();
        });

        // Swipe gestures on mobile
        let swipeStartX = 0;
        lightboxImg.addEventListener('touchstart', e => {
            swipeStartX = e.touches[0].clientX;
        }, { passive: true });

        lightboxImg.addEventListener('touchend', e => {
            const swipeEndX = e.changedTouches[0].clientX;
            const diffX = swipeStartX - swipeEndX;
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextImg();
                } else {
                    prevImg();
                }
            }
        }, { passive: true });
    }

    // ── Interactive Tab Switcher for Services ───────────────────────────────
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // Remove active classes
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Add active classes
                btn.classList.add('active');
                const activePane = document.getElementById(`tab-${targetTab}`);
                if (activePane) {
                    activePane.classList.add('active');
                }
            });
        });
    }

    // Initialize dynamic grid
    renderProjectsGrid();
});
