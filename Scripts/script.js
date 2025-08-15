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

    let currentIdx = 0;
    const items = Array.from(grid.children);

    // Função para exibir apenas a imagem atual no mobile
    function showMobileImage() {
        items.forEach((item, idx) => {
            item.style.display = idx === currentIdx ? 'block' : 'none';
        });
    }

    // Configuração inicial com base no tamanho da tela
    if (window.matchMedia('(max-width: 768px)').matches) {
        showMobileImage();
    } else {
        showItems();
    }

    // Event listeners para as setas
    function handleMobileNavigation(direction) {
        if (direction === 'prev' && currentIdx > 0) {
            currentIdx--;
            showMobileImage();
        } else if (direction === 'next' && currentIdx < items.length - 1) {
            currentIdx++;
            showMobileImage();
        }
    }

    function handleDesktopNavigation(direction) {
        if (direction === 'prev' && startIdx > 0) {
            startIdx -= ITEMS_PER_PAGE;
            showItems();
        } else if (direction === 'next') {
            const filteredItems = getFilteredItems();
            if (startIdx + ITEMS_PER_PAGE < filteredItems.length) {
                startIdx += ITEMS_PER_PAGE;
                showItems();
            }
        }
    }

    // Função principal de navegação
    function handleNavigation(direction, isMobile) {
        if (isMobile) {
            handleMobileNavigation(direction);
        } else {
            handleDesktopNavigation(direction);
        }
    }

    // Event listeners iniciais
    document.getElementById('arrow-left').addEventListener('click', () => {
        handleNavigation('prev', window.matchMedia('(max-width: 768px)').matches);
    });

    document.getElementById('arrow-right').addEventListener('click', () => {
        handleNavigation('next', window.matchMedia('(max-width: 768px)').matches);
    });

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

    // Adicione este código ao seu JavaScript
    function setupMobileArrows() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const portfolioWrapper = document.querySelector('.portfolio-grid-wrapper');
        const arrowLeft = document.getElementById('arrow-left');
        const arrowRight = document.getElementById('arrow-right');
        
        // Cria container para setas mobile
        const mobileArrowsContainer = document.createElement('div');
        mobileArrowsContainer.className = 'mobile-arrows-container';
        
        function reorganizeArrows() {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) { // mobile
                if (!document.querySelector('.mobile-arrows-container')) {
                    // Remove as setas da posição original
                    arrowLeft.remove();
                    arrowRight.remove();
                    
                    // Recria as setas na ordem correta
                    mobileArrowsContainer.innerHTML = '';
                    const newArrowLeft = arrowLeft.cloneNode(true);
                    const newArrowRight = arrowRight.cloneNode(true);
                    
                    // Mantém os mesmos IDs para manter a funcionalidade
                    newArrowLeft.id = 'arrow-left';
                    newArrowRight.id = 'arrow-right';
                    
                    // Mantém as setas nos lados corretos
                    mobileArrowsContainer.appendChild(newArrowLeft);
                    mobileArrowsContainer.appendChild(newArrowRight);
                    
                    // Adiciona após o grid
                    portfolioGrid.parentNode.insertBefore(mobileArrowsContainer, portfolioGrid.nextSibling);
                    
                    // Reaplica os event listeners
                    newArrowLeft.addEventListener('click', () => {
                        handleNavigation('prev', true);
                    });
                    
                    newArrowRight.addEventListener('click', () => {
                        handleNavigation('next', true);
                    });
                }
            } else { // desktop
                const mobileContainer = document.querySelector('.mobile-arrows-container');
                if (mobileContainer) {
                    mobileContainer.remove();
                }
                
                // Restaura as setas na posição original para desktop
                if (!portfolioWrapper.contains(arrowLeft)) {
                    portfolioWrapper.insertBefore(arrowLeft, portfolioGrid);
                    portfolioWrapper.appendChild(arrowRight);
                    
                    // Reaplica os event listeners para desktop
                    arrowLeft.addEventListener('click', () => {
                        handleNavigation('prev', false);
                    });
                    
                    arrowRight.addEventListener('click', () => {
                        handleNavigation('next', false);
                    });
                }
            }
            
            // Atualiza a exibição baseada no modo atual
            if (isMobile) {
                showMobileImage();
            } else {
                showItems();
            }
        }

        // Executa quando a página carrega
        reorganizeArrows();
        
        // Executa quando a janela é redimensionada
        window.addEventListener('resize', reorganizeArrows);
    }

    // Chama a função quando o documento estiver pronto
    setupMobileArrows();
});