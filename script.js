    // Data gambar produk
    const images = [
      {
        src: "img/jadi.png",
        alt: "EggSalt kemasan premium"
      },
      {
        src: "img/proses.png",
        alt: "Proses pembuatan telur asin"
      },
      {
        src: "img/tutorial.png",
        alt: "Tutorial penyajian telur asin"
      }
    ];

    // Variabel global
    let currentSlide = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let autoSlideInterval;

    // Elemen DOM
    const galleryContainer = document.getElementById('galleryContainer');
    const galleryNav = document.getElementById('galleryNav');
    const modal = document.getElementById('imageModal');
    const modalSlider = document.getElementById('modalSlider');
    const modalDots = document.getElementById('modalDots');

    // Inisialisasi galeri
    function initGallery() {
      // Kosongkan container
      galleryContainer.innerHTML = '';
      galleryNav.innerHTML = '';
      modalSlider.innerHTML = '';
      modalDots.innerHTML = '';
      
      // Buat slides untuk galeri utama
      images.forEach((image, index) => {
        // Slide galeri utama
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        slide.innerHTML = `
          <img src="${image.src}" alt="${image.alt}" onclick="openModal(${index})">
          <div class="slide-number">${index + 1} / ${images.length}</div>
        `;
        galleryContainer.appendChild(slide);
        
        // Navigation dot
        const dot = document.createElement('button');
        dot.className = 'nav-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        galleryNav.appendChild(dot);
        
        // Modal slide
        const modalSlide = document.createElement('div');
        modalSlide.className = 'modal-slide';
        modalSlide.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
        modalSlider.appendChild(modalSlide);
        
        // Modal dot
        const modalDot = document.createElement('button');
        modalDot.className = 'modal-dot';
        if (index === 0) modalDot.classList.add('active');
        modalDot.addEventListener('click', () => goToModalSlide(index));
        modalDots.appendChild(modalDot);
      });
      
      // Setup drag events untuk galeri
      setupDragEvents();
      
      // Setup drag events untuk modal
      setupModalDragEvents();
      
      // Mulai auto slide
      startAutoSlide();
      
      // Update galeri
      updateGallery();
    }

    // Setup drag events untuk galeri
    function setupDragEvents() {
      galleryContainer.addEventListener('mousedown', dragStart);
      galleryContainer.addEventListener('touchstart', dragStart);
      galleryContainer.addEventListener('mouseup', dragEnd);
      galleryContainer.addEventListener('touchend', dragEnd);
      galleryContainer.addEventListener('mouseleave', dragEnd);
      galleryContainer.addEventListener('mousemove', drag);
      galleryContainer.addEventListener('touchmove', drag);
      
      // Prevent context menu pada touch
      galleryContainer.addEventListener('contextmenu', e => e.preventDefault());
    }

    // Setup drag events untuk modal
    function setupModalDragEvents() {
      modalSlider.addEventListener('mousedown', modalDragStart);
      modalSlider.addEventListener('touchstart', modalDragStart);
      modalSlider.addEventListener('mouseup', modalDragEnd);
      modalSlider.addEventListener('touchend', modalDragEnd);
      modalSlider.addEventListener('mouseleave', modalDragEnd);
      modalSlider.addEventListener('mousemove', modalDrag);
      modalSlider.addEventListener('touchmove', modalDrag);
      
      // Prevent context menu pada touch
      modalSlider.addEventListener('contextmenu', e => e.preventDefault());
    }

    // Fungsi drag untuk galeri
    function dragStart(e) {
      if (e.type === 'touchstart') {
        startPos = e.touches[0].clientX;
      } else {
        startPos = e.clientX;
        e.preventDefault();
      }
      
      isDragging = true;
      galleryContainer.style.cursor = 'grabbing';
      galleryContainer.style.scrollBehavior = 'auto';
      
      // Animation frame untuk smooth dragging
      animationID = requestAnimationFrame(animation);
    }

    function drag(e) {
      if (!isDragging) return;
      
      const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function dragEnd() {
      isDragging = false;
      galleryContainer.style.cursor = 'grab';
      galleryContainer.style.scrollBehavior = 'smooth';
      cancelAnimationFrame(animationID);
      
      const movedBy = currentTranslate - prevTranslate;
      
      // Jika drag cukup jauh, pindah slide
      if (movedBy < -100 && currentSlide < images.length - 1) {
        currentSlide += 1;
      }
      
      if (movedBy > 100 && currentSlide > 0) {
        currentSlide -= 1;
      }
      
      // Reset position
      currentTranslate = 0;
      prevTranslate = 0;
      
      // Update galeri
      goToSlide(currentSlide);
    }

    // Fungsi drag untuk modal
    let modalIsDragging = false;
    let modalStartPos = 0;
    let modalCurrentTranslate = 0;
    let modalPrevTranslate = 0;
    let modalAnimationID;

    function modalDragStart(e) {
      if (e.type === 'touchstart') {
        modalStartPos = e.touches[0].clientX;
      } else {
        modalStartPos = e.clientX;
        e.preventDefault();
      }
      
      modalIsDragging = true;
      modalSlider.style.cursor = 'grabbing';
      modalSlider.style.scrollBehavior = 'auto';
      
      // Animation frame untuk smooth dragging
      modalAnimationID = requestAnimationFrame(modalAnimation);
    }

    function modalDrag(e) {
      if (!modalIsDragging) return;
      
      const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      modalCurrentTranslate = modalPrevTranslate + currentPosition - modalStartPos;
    }

    function modalDragEnd() {
      modalIsDragging = false;
      modalSlider.style.cursor = 'grab';
      modalSlider.style.scrollBehavior = 'smooth';
      cancelAnimationFrame(modalAnimationID);
      
      const movedBy = modalCurrentTranslate - modalPrevTranslate;
      
      // Jika drag cukup jauh, pindah slide
      if (movedBy < -100 && currentSlide < images.length - 1) {
        currentSlide += 1;
      }
      
      if (movedBy > 100 && currentSlide > 0) {
        currentSlide -= 1;
      }
      
      // Reset position
      modalCurrentTranslate = 0;
      modalPrevTranslate = 0;
      
      // Update modal
      goToModalSlide(currentSlide);
    }

    // Animation functions
    function animation() {
      if (!isDragging) return;
      galleryContainer.scrollLeft = -currentTranslate;
      requestAnimationFrame(animation);
    }

    function modalAnimation() {
      if (!modalIsDragging) return;
      modalSlider.scrollLeft = -modalCurrentTranslate;
      requestAnimationFrame(modalAnimation);
    }

    // Navigasi slide
    function goToSlide(index) {
      currentSlide = index;
      updateGallery();
      resetAutoSlide();
    }

    function prevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
      } else {
        currentSlide = images.length - 1;
      }
      updateGallery();
      resetAutoSlide();
    }

    function nextSlide() {
      if (currentSlide < images.length - 1) {
        currentSlide++;
      } else {
        currentSlide = 0;
      }
      updateGallery();
      resetAutoSlide();
    }

    // Update tampilan galeri
    function updateGallery() {
      galleryContainer.scrollTo({
        left: galleryContainer.clientWidth * currentSlide,
        behavior: 'smooth'
      });
      
      // Update navigation dots
      document.querySelectorAll('.nav-dot').forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Modal functions
    function openModal(index) {
      currentSlide = index;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      updateModal();
      clearInterval(autoSlideInterval);
    }

    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      startAutoSlide();
    }

    function goToModalSlide(index) {
      currentSlide = index;
      updateModal();
    }

    function prevModalSlide() {
      if (currentSlide > 0) {
        currentSlide--;
      } else {
        currentSlide = images.length - 1;
      }
      updateModal();
    }

    function nextModalSlide() {
      if (currentSlide < images.length - 1) {
        currentSlide++;
      } else {
        currentSlide = 0;
      }
      updateModal();
    }

    function updateModal() {
      modalSlider.scrollTo({
        left: modalSlider.clientWidth * currentSlide,
        behavior: 'smooth'
      });
      
      // Update modal dots
      document.querySelectorAll('.modal-dot').forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Auto slide
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }
    // Fungsi untuk WhatsApp
    function contactWhatsApp() {
      const phoneNumber = "6282121324045";
      const message = "Halo, saya ingin bertanya tentang EggSalt";
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Animasi tombol WhatsApp
      const whatsappBtn = document.querySelector('.btn-whatsapp');
      whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Membuka...';
      whatsappBtn.style.background = 'linear-gradient(90deg, #128C7E, #075E54)';
      
      setTimeout(() => {
        window.open(url, '_blank');
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Hubungi Kami';
        whatsappBtn.style.background = 'linear-gradient(90deg, #25D366, #128C7E)';
      }, 800);
    }
    
    // Animasi scroll untuk elemen
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);
    
    // Terapkan observer ke semua elemen dengan animasi
    document.querySelectorAll('.product-gallery, .product-info, .digital-innovation').forEach(el => {
      observer.observe(el);
    });

    // Inisialisasi galeri saat halaman dimuat
    document.addEventListener('DOMContentLoaded', initGallery);
    
    // Tambah event listener untuk keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft') {
          prevModalSlide();
        } else if (e.key === 'ArrowRight') {
          nextModalSlide();
        }
      }
    });