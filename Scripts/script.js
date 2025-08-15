document.addEventListener('DOMContentLoaded', function() {

    const filterButtons = document.querySelectorAll('#portfolio-filtros .filter-btn');
    const grid = document.getElementById('portfolio-grid');
    const allItems = Array.from(grid.children);
    let currentSection = 'Tudo';
    let startIdx = 0;
    const ITEMS_PER_PAGE = 8;

    function getFilteredItems() {
        if (currentSection === 'Tudo') {
            return allItems;
        }
        return allItems.filter(item => {
            const sections = item.dataset.section.split(',');
            return sections.map(s => s.trim()).includes(currentSection);
        });
    }

    function updatePageInfo() {
        const filteredItems = getFilteredItems();
        const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
        const currentPage = Math.floor(startIdx / ITEMS_PER_PAGE) + 1;
        document.getElementById('portfolio-page-info').textContent = `Página ${currentPage} de ${totalPages}`;
    }

    function showItems() {
        const filteredItems = getFilteredItems();
        allItems.forEach(item => item.style.display = 'none');
        filteredItems.slice(startIdx, startIdx + ITEMS_PER_PAGE).forEach(item => item.style.display = 'flex');
        updatePageInfo();
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSection = btn.getAttribute('data-filter');
            startIdx = 0;
            showItems();
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('arrow-left').onclick = () => {
        if (startIdx > 0) {
            startIdx -= ITEMS_PER_PAGE;
            showItems();
        }
    };

    document.getElementById('arrow-right').onclick = () => {
        const filteredItems = getFilteredItems();
        if (startIdx + ITEMS_PER_PAGE < filteredItems.length) {
            startIdx += ITEMS_PER_PAGE;
            showItems();
        }
    };

    showItems();

    // Popup para galeria
    const galleryItemsPortfolio = document.querySelectorAll('.portfolio-grid .gallery-item');
    const popup = document.getElementById('portfolio-popup');
    const popupImg = document.getElementById('popup-img');
    const popupClose = document.getElementById('popup-close');
    const popupOverlay = document.querySelector('.popup-overlay');

    galleryItemsPortfolio.forEach(item => {
        item.addEventListener('click', function() {
            const img = item.querySelector('img');
            popupImg.src = img.src;
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closePopup() {
        popup.classList.remove('active');
        popupImg.src = '';
        document.body.style.overflow = '';
    }

    popupClose.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', closePopup);

    document.addEventListener('keydown', function(e) {
        if (popup.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
            closePopup();
        }
    });

    const contatoLink = document.getElementById('contato-link');
    const sobreSection = document.getElementById('sobre');
    const sobreImgs = document.querySelectorAll('#sobre .img-hover-container');
    const sobreOverlays = document.querySelectorAll('#sobre .img-overlay');

    contatoLink.addEventListener('click', function(e) {
        e.preventDefault();
        sobreSection.scrollIntoView({ behavior: 'smooth' });

        // Exibe ambos os overlays
        sobreOverlays.forEach(overlay => {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        });

        // Ao passar mouse em qualquer imagem, mostra só o overlay daquela imagem
        sobreImgs.forEach(container => {
            container.addEventListener('mouseenter', () => {
                sobreOverlays.forEach(overlay => {
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                });
                container.querySelector('.img-overlay').style.opacity = '1';
                container.querySelector('.img-overlay').style.pointerEvents = 'auto';
            });
            container.addEventListener('mouseleave', () => {
                sobreOverlays.forEach(overlay => {
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                });
            });
        });
    });
});