/* BARKEA RESORT js*/
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.style.display = 'none';
    }, { once: true });
  });

  window.moveSlide = function (btnEl, direction) {
    const container = btnEl.closest('[data-slider]');
    if (!container) return;

    const slides = Array.from(container.querySelectorAll('.slide'));
    if (!slides.length) return;

    let activeIndex = slides.findIndex(function (s) { return s.classList.contains('active'); });
    if (activeIndex === -1) activeIndex = 0;

    slides[activeIndex].classList.remove('active');
    const nextIndex = (activeIndex + direction + slides.length) % slides.length;
    slides[nextIndex].classList.add('active');

    const counter = container.querySelector('.slide-counter');
    if (counter) counter.textContent = (nextIndex + 1) + ' / ' + slides.length;
  };

  const typologyFilter = document.getElementById('typologyFilter');
  const statusFilter = document.getElementById('statusFilter');
  const resetFilterBtn = document.getElementById('resetFilterBtn');
  const resultsCountEl = document.getElementById('filterResultsCount');
  const villaCards = Array.from(document.querySelectorAll('.villas-main-grid .barkea-card'));

  function applyFilters(updateUrl) {
    if (!typologyFilter || !statusFilter) return;

    const typeVal = typologyFilter.value;
    const statusVal = statusFilter.value;
    let visibleCount = 0;

    villaCards.forEach(function (card) {
      const matchesType = typeVal === 'all' || card.dataset.type === typeVal;
      const matchesStatus = statusVal === 'all' || card.dataset.status === statusVal;
      const isVisible = matchesType && matchesStatus;
      card.style.display = isVisible ? '' : 'none';
      if (isVisible) visibleCount++;
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = visibleCount + (visibleCount === 1 ? ' unit found' : ' units found');
    }

    if (updateUrl) {
      const params = new URLSearchParams(window.location.search);
      typeVal === 'all' ? params.delete('type') : params.set('type', typeVal);
      statusVal === 'all' ? params.delete('status') : params.set('status', statusVal);
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
  }

  if (typologyFilter && statusFilter && villaCards.length) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlType = urlParams.get('type');
    const urlStatus = urlParams.get('status');

    if (urlType && Array.from(typologyFilter.options).some(function (o) { return o.value === urlType; })) {
      typologyFilter.value = urlType;
    }
    if (urlStatus && Array.from(statusFilter.options).some(function (o) { return o.value === urlStatus; })) {
      statusFilter.value = urlStatus;
    }

    applyFilters(false);

    typologyFilter.addEventListener('change', function () { applyFilters(true); });
    statusFilter.addEventListener('change', function () { applyFilters(true); });

    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', function () {
        typologyFilter.value = 'all';
        statusFilter.value = 'all';
        applyFilters(true);
      });
    }
  }

  const villaModal = document.getElementById('villaModal');

  if (villaModal && villaCards.length) {
    const modalImg = document.getElementById('villaModalImg');
    const modalStatus = document.getElementById('villaModalStatus');
    const modalMeta = document.getElementById('villaModalMeta');
    const modalTitle = document.getElementById('villaModalTitle');
    const modalDesc = document.getElementById('villaModalDesc');
    const modalPlan = document.getElementById('villaModalPlan');
    const modalPlanFallback = document.getElementById('villaModalPlanFallback');

    function openVillaModal(card) {
      const img = card.querySelector('.card-image-wrap img');
      const statusEl = card.querySelector('.image-tag');
      const meta = card.querySelector('.card-meta span');
      const title = card.querySelector('.card-title');
      const desc = card.querySelector('.card-desc');
      const planSrc = card.dataset.plan;

      modalImg.style.display = '';
      modalImg.src = img ? img.src : '';
      modalImg.alt = title ? title.textContent : 'Villa';
      modalStatus.textContent = statusEl ? statusEl.textContent : '';
      modalStatus.className = statusEl ? 'image-tag ' + statusEl.className.replace('image-tag', '').trim() : 'image-tag';
      modalMeta.textContent = meta ? meta.textContent : '';
      modalTitle.textContent = title ? title.textContent : '';
      modalDesc.textContent = desc ? desc.textContent : '';

      modalPlan.style.display = 'none';
      modalPlanFallback.style.display = 'none';
      if (planSrc) {
        const testImg = new Image();
        testImg.onload = function () {
          modalPlan.src = planSrc;
          modalPlan.style.display = 'block';
        };
        testImg.onerror = function () {
          modalPlanFallback.style.display = 'block';
        };
        testImg.src = planSrc;
      } else {
        modalPlanFallback.style.display = 'block';
      }

      villaModal.classList.add('active');
      villaModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeVillaModal() {
      villaModal.classList.remove('active');
      villaModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    villaCards.forEach(function (card) {
      card.addEventListener('click', function () { openVillaModal(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openVillaModal(card);
        }
      });
    });

    villaModal.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (el.tagName === 'A') return;
        closeVillaModal();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && villaModal.classList.contains('active')) closeVillaModal();
    });
  }


  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');

  window.openLightbox = function (src) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.style.display = '';
    lightboxImg.src = src;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const archImageWrapper = document.querySelector('.arch-image-wrapper');
  if (archImageWrapper) {
    archImageWrapper.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = archImageWrapper.querySelector('img');
        if (img) window.openLightbox(img.src);
      }
    });
  }

  if (lightboxModal) {
    if (lightboxImg) {
      lightboxImg.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    const closeBtn = lightboxModal.querySelector('.lightbox-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        window.closeLightbox();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) window.closeLightbox();
    });
  }


  const whyScrollWrapper = document.getElementById('scrollWrapper');

  if (whyScrollWrapper) {
    const whyCards = Array.from(whyScrollWrapper.querySelectorAll('.why-card'));
    const textSlides = Array.from(document.querySelectorAll('.why-text-area .text-slide'));

    function setActiveWhyIndex(index) {
      textSlides.forEach(function (slide) {
        slide.classList.toggle('active', Number(slide.dataset.index) === index);
      });
    }

    let currentIndex = 0;
    const observer = new IntersectionObserver(function (entries) {
      let bestEntry = null;
      entries.forEach(function (entry) {
        if (entry.isIntersecting && (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)) {
          bestEntry = entry;
        }
      });
      if (bestEntry) {
        const idx = Number(bestEntry.target.dataset.index);
        if (!Number.isNaN(idx)) {
          currentIndex = idx;
          setActiveWhyIndex(idx);
        }
      }
    }, { root: whyScrollWrapper, threshold: [0.5, 0.75, 1] });

    whyCards.forEach(function (card) { observer.observe(card); });

    function scrollWhyColumnTo(index) {
      const card = whyCards[index];
      if (!card) return;
      const wrapperRect = whyScrollWrapper.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const targetScrollTop = whyScrollWrapper.scrollTop + (cardRect.top - wrapperRect.top);
      whyScrollWrapper.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
    }


    textSlides.forEach(function (slide) {
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', function () {
        scrollWhyColumnTo(Number(slide.dataset.index));
      });
    });


    let autoplayTimer = null;
    let resumeTimer = null;

    function stepAutoplay() {
      const nextIndex = (currentIndex + 1) % whyCards.length;
      scrollWhyColumnTo(nextIndex);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(stepAutoplay, 4500);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    function pauseThenResumeAutoplay() {
      stopAutoplay();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAutoplay, 6000);
    }

    ['wheel', 'touchstart', 'mousedown'].forEach(function (evt) {
      whyScrollWrapper.addEventListener(evt, pauseThenResumeAutoplay, { passive: true });
    });

    startAutoplay();
  }


  const serviceNodes = Array.from(document.querySelectorAll('.service-node'));
  const dynamicImage = document.getElementById('dynamicImage');
  const dynamicTag = document.getElementById('dynamicTag');
  const dynamicTitle = document.getElementById('dynamicTitle');
  const dynamicDesc = document.getElementById('dynamicDesc');
  const circleDiagram = document.querySelector('.circle-diagram');

  if (serviceNodes.length && dynamicImage) {

    function activateNode(node) {
      serviceNodes.forEach(function (n) { n.classList.remove('active'); });
      node.classList.add('active');

      dynamicImage.style.opacity = '0';
      setTimeout(function () {
        dynamicImage.src = node.dataset.img || dynamicImage.src;
        dynamicImage.style.opacity = '1';
      }, 200);

      if (dynamicTag) dynamicTag.textContent = node.dataset.tag || '';
      if (dynamicTitle) dynamicTitle.textContent = node.dataset.title || '';
      if (dynamicDesc) dynamicDesc.textContent = node.dataset.desc || '';
    }

    let currentNodeIndex = serviceNodes.findIndex(function (n) { return n.classList.contains('active'); });
    if (currentNodeIndex === -1) currentNodeIndex = 0;

    let devAutoplayTimer = null;
    let devResumeTimer = null;

    function stepDevAutoplay() {
      currentNodeIndex = (currentNodeIndex + 1) % serviceNodes.length;
      activateNode(serviceNodes[currentNodeIndex]);
    }

    function startDevAutoplay() {
      stopDevAutoplay();
      devAutoplayTimer = setInterval(stepDevAutoplay, 4000);
    }

    function stopDevAutoplay() {
      if (devAutoplayTimer) clearInterval(devAutoplayTimer);
      devAutoplayTimer = null;
    }

    function pauseThenResumeDevAutoplay() {
      stopDevAutoplay();
      if (devResumeTimer) clearTimeout(devResumeTimer);
      devResumeTimer = setTimeout(startDevAutoplay, 5000);
    }

    serviceNodes.forEach(function (node, index) {
      node.addEventListener('click', function () {
        currentNodeIndex = index;
        activateNode(node);
        pauseThenResumeDevAutoplay();
      });
    });

    if (circleDiagram) {
      circleDiagram.addEventListener('mouseenter', stopDevAutoplay);
      circleDiagram.addEventListener('mouseleave', startDevAutoplay);
    }

    startDevAutoplay();
  }

  /* NAVBAR- transparent te homepage dhe me pas i dukshem */
  const siteNav = document.getElementById('siteNav');
  if (siteNav) {
    const heroSection = document.getElementById('homepage');

    function updateNavState() {
      const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
      siteNav.classList.toggle('nav-solid', heroBottom <= siteNav.offsetHeight);
    }

    window.addEventListener('scroll', updateNavState, { passive: true });
    window.addEventListener('resize', updateNavState);
    updateNavState();
  }

  /* NAVBAR LANGUAGE*/
  const NAV_I18N = {
    en: { concept: 'The Concept', villas: 'Villas', design: 'Design', gallery: 'Gallery', contact: 'Contact', more: 'More', video: 'Video', location: 'Location', why: 'Why BarkeaResort?', brochure: 'Brochure' },
    al: { concept: 'Koncepti', villas: 'Vilat', design: 'Dizajni', gallery: 'Galeria', contact: 'Kontakti', more: 'Më shumë', video: 'Video', location: 'Vendndodhja', why: 'Pse BarkeaResort?', brochure: 'Broshura' },
    it: { concept: 'Il Concetto', villas: 'Ville', design: 'Design', gallery: 'Galleria', contact: 'Contatti', more: 'Altro', video: 'Video', location: 'Posizione', why: 'Perché BarkeaResort?', brochure: 'Brochure' }
  };
  const CONTENT_I18N = {
    al: {
      'PROPERTY': 'PRONA',
      'PARTNERS': 'PARTNERË',
      'SALES': 'SHITJE',
      'OPERATIONS': 'OPERACIONE',
      'RESIDENTIAL ESTATE': 'KOMPLEKS REZIDENCIAL',
      'DISCOVER': 'ZBULO',
      'LOCATION': 'VENDNDODHJA',
      'Lunder, Farke — close enough, quiet enough.': 'Lunder, Farke — mjaft afër, mjaft i qetë.',
      'Southeast of Tirana, the Lunder–Farke area has become one of the capital\'s defining residential zones: greener and calmer than the centre, with a fast, direct connection back into the city.': 'Në juglindje të Tiranës, zona Lunder–Farke është bërë një nga zonat rezidenciale më përcaktuese të kryeqytetit: më e gjelbër dhe më e qetë se qendra, me lidhje të shpejtë dhe të drejtpërdrejtë përsëri me qytetin.',
      'Driving distance': 'Distanca me makinë',
      'to central Tirana': 'deri në qendër të Tiranës',
      'SE': 'JL',
      'Positioned': 'E pozicionuar',
      'in the southeast growth corridor': 'në korridorin e rritjes juglindore',
      'Low': 'E ulët',
      'Building density': 'Dendësia e ndërtimit',
      'relative to central neighbourhoods': 'në krahasim me lagjet qendrore',
      'High': 'E lartë',
      'Green cover': 'Mbulesa e gjelbër',
      'and residential character': 'dhe karakter rezidencial',
      'GALLERY': 'GALERIA',
      'The project in images': 'Projekti në imazhe',
      'SWIPE TO EXPLORE': 'SHUAJ PËR TË ZBULUAR',
      'The Concept': 'Koncepti',
      'A new standard of luxury living': 'Një standard i ri i jetesës luksoze',
      'Barkea Resort redefines elegance by harmonizing with the serene natural beauty of Farka. Every detail is crafted to offer a lifestyle of absolute privacy, comfort, and sophistication.': 'Barkea Resort ripërcakton elegancën duke u harmonizuar me bukurinë natyrore të qetë të Farkës. Çdo detaj është punuar për të ofruar një stil jetese me privatësi absolute, rehati dhe sofistikim.',
      'A residential complex built around a single idea:': 'Një kompleks rezidencial i ndërtuar rreth një ideje të vetme:',
      'proximity without density.': 'afërsi pa dendësi.',
      'Our villas are thoughtfully designed to maximize natural light and seamless indoor-outdoor living. Positioned perfectly along the terrain, each residence guarantees panoramic views, total independence, and a deep connection with the surrounding landscape.': 'Vilat tona janë projektuar me kujdes për të maksimizuar dritën natyrale dhe lidhjen e pandërprerë mes brendësisë dhe jashtmes. Të pozicionuara në mënyrë perfekte përgjatë terrenit, çdo rezidencë garanton pamje panoramike, pavarësi të plotë dhe lidhje të thellë me peizazhin përreth.',
      '“A place to live first, an investment second.”': '“Një vend për të jetuar në radhë të parë, një investim në radhë të dytë.”',
      'THE RESORT COMPLEX': 'KOMPLEKSI I RESORT-IT',
      'Six rows, thirty-seven villas.': 'Gjashtë rreshta, tridhjetë e shtatë vila.',
      'The complex is organised into six linear rows of villas. Each row follows the same architectural principles — massing, materials, roof lines — while individual plots, verandas and outdoor areas vary by position and typology.': 'Kompleksi është i organizuar në gjashtë rreshta linearë vilash. Çdo rresht ndjek të njëjtat parime arkitekturore — vëllime, materiale, linja çatish — ndërsa parcelat individuale, verandat dhe hapësirat e jashtme ndryshojnë sipas pozicionit dhe tipologjisë.',
      'click to see...': 'kliko për të parë...',
      'Villas & Categories': 'Vilat & Kategoritë',
      'Villa A': 'Vila A',
      'Villa B': 'Vila B',
      'Villa C': 'Vila C',
      'Villa': 'Vila',
      'Exclusive residences blending modern comfort with nature.': 'Rezidenca ekskluzive që përzjejnë rehatinë moderne me natyrën.',
      'INTERIOR SURFACE': 'SIPËRFAQJA E BRENDSHME',
      'LAND AREA': 'SIPËRFAQJA E TOKËS',
      'Available in 2 or 3-story layouts (A1-A8) featuring optimized modern interiors, private pool, storage, and outdoor entertainment areas.': 'Në dispozicion me planimetri 2 ose 3-katëshe (A1-A8), me brendësi moderne të optimizuara, pishinë private, depo dhe zona argëtimi në ambientet e jashtme.',
      'See more...': 'Shiko më shumë...',
      'Spacious luxury residences designed for ultimate comfort.': 'Rezidenca luksoze e të gjera, të projektuara për rehati maksimale.',
      'Offering 3 to 4-story layouts (B1-B7) with large private plots, professional modern design, private pool, and outdoor amenities.': 'Ofrojnë planimetri 3 deri 4-katëshe (B1-B7) me parcela private të mëdha, dizajn modern profesional, pishinë private dhe pajisje në ambientet e jashtme.',
      'Modern architecture with panoramic views and refined luxury.': 'Arkitekturë moderne me pamje panoramike dhe luks të rafinuar.',
      '3-story structures (C1-C7) featuring specialized top-floor layouts with panoramic verandas overlooking the entire complex, plus private pool and leisure spaces.': 'Struktura 3-katëshe (C1-C7) me planimetri të veçanta në katin e fundit, me veranda panoramike që shohin mbi gjithë kompleksin, plus pishinë private dhe hapësira çlodhjeje.',
      'Customizable luxury residences with tailored ad hoc layouts.': 'Rezidenca luksoze të personalizueshme me planimetri të përshtatura ad hoc.',
      'Featuring 3 floors and 1 underground level with private verandas and individual parking. Designed with a unified architectural style while allowing clients to customize spaces ad hoc.': 'Me 3 kate dhe 1 nivel nëntokësor, me veranda private dhe parkim individual. Të projektuara me një stil arkitektonik të unifikuar, duke i lejuar klientët të personalizojnë hapësirat ad hoc.',
      'Architecture & Masterplan': 'Arkitektura & Masterplani',
      'A harmonious blend of form, function, and nature.': 'Një përzierje harmonike e formës, funksionit dhe natyrës.',
      'MASTERPLAN CONCEPT': 'KONCEPTI I MASTERPLANIT',
      'Integrated Terrain & Smart Zoning': 'Terren i integruar & zonim i zgjuar',
      'The architectural masterplan is carefully designed to follow the natural topography of the land. Every villa position is optimized to guarantee maximum privacy, unobstructed panoramic views, and seamless connection with lush green environments and recreational zones.': 'Masterplani arkitektonik është projektuar me kujdes për të ndjekur topografinë natyrore të tokës. Çdo pozicion vile është optimizuar për të garantuar privatësi maksimale, pamje panoramike pa pengesa dhe lidhje të pandërprerë me mjediset e gjelbra dhe zonat e rekreacionit.',
      'Optimal sun orientation for every residence': 'Orientim optimal ndaj diellit për çdo rezidencë',
      'Private access roads and dedicated parking zones': 'Rrugë private aksesi dhe zona të dedikuara parkimi',
      'Extensive green corridors and community spaces': 'Korridore të gjera të gjelbra dhe hapësira komunitare',
      'CLICK TO SEE LARGER': 'KLIKO PËR TA SHIKUAR MË TË MADHE',
      'ON SITE': 'NË VEND',
      'Why Barkea Resort': 'Pse Barkea Resort',
      'Privileged Location': 'Vendndodhje e privilegjuar',
      'Just 8 km from Tirana in a peaceful, well-connected green zone.': 'Vetëm 8 km nga Tirana, në një zonë të gjelbër të qetë dhe të lidhur mirë.',
      'Privacy & Greenery': 'Privatësi & gjelbërim',
      'Only 37 private villas with large plots for absolute privacy.': 'Vetëm 37 vila private me parcela të mëdha për privatësi absolute.',
      'Exclusive Design': 'Dizajn ekskluziv',
      'Modern architecture featuring large glass facades and top standards.': 'Arkitekturë moderne me fasada të mëdha xhami dhe standarde të larta.',
      'Ad Hoc Flexibility': 'Fleksibilitet ad hoc',
      'Fully customizable interiors tailored to your preferences.': 'Brendësi plotësisht të personalizueshme sipas preferencave tuaja.',
      'Secure Investment': 'Investim i sigurt',
      'An elite area guaranteeing strong long-term property value growth.': 'Një zonë elitare që garanton rritje të fortë të vlerës së pronës në afat të gjatë.',
      'Private Pools': 'Pishina private',
      'Spacious private yards designed for your own swimming pool.': 'Oborre private të gjera, të projektuara për pishinën tuaj.',
      'Recreation & Leisure': 'Rekreacion & çlodhje',
      'Safe, gated community with 24/7 security and scenic walkways.': 'Komunitet i sigurt dhe i mbyllur, me siguri 24/7 dhe shtigje piktoreske.',
      'SCROLL TO EXPLORE': 'SKROLLO PËR TË ZBULUAR',
      'The developer': 'Zhvilluesi',
      'is the developer of Barkea Resort — the company behind the project.': 'është zhvilluesi i Barkea Resort — kompania prapa projektit.',
      'The circle maps the phases of the project: site selection and master planning, underground engineering and infrastructure, structural construction, insulation and exterior facades, and landscaping, private pools and handover — with owner support, ad hoc client consultation and post-handover support alongside.The project has progressed through these phases: on the Villas page, the 15 Phase 1 units are marked Completed and the 22 villas of the A, B and C series In Progress — 37 villas in total. Select a phase in the circle to see what it covers.': 'Rrethi paraqet fazat e projektit: përzgjedhja e vendit dhe planifikimi i masterplanit, inxhinieria nëntokësore dhe infrastruktura, ndërtimi strukturor, izolimi dhe fasadat e jashtme, si dhe peizazhi, pishinat private dhe dorëzimi — së bashku me mbështetjen për pronarët, konsultimin ad hoc me klientët dhe mbështetjen pas dorëzimit. Projekti ka përparuar përmes këtyre fazave: në faqen Vilat, 15 njësitë e Fazës 1 janë shënuar Përfunduar dhe 22 vilat e serive A, B dhe C Në ndërtim — gjithsej 37 vila. Zgjidh një fazë në rreth për të parë çfarë përfshin.',
      'CONCIERGE': 'KONSJERZH',
      'Owner support': 'Mbështetje për pronarët',
      'A dedicated contact who knows your residence at Barkea and follows you over time.': 'Një kontakt i dedikuar që e njeh rezidencën tuaj në Barkea dhe ju shoqëron me kalimin e kohës.',
      'Owner Support': 'Mbështetje për pronarët',
      'PLANNING': 'PLANIFIKIM',
      'Site Selection & Master Planning': 'Përzgjedhja e vendit & masterplani',
      'Strategic placement and architectural blueprint design managed by Dijon & team.': 'Vendosje strategjike dhe projektim i planit arkitektonik, të menaxhuara nga Dijon & ekipi.',
      'INFRASTRUCTURE': 'INFRASTRUKTURË',
      'Underground Engineering': 'Inxhinieria nëntokësore',
      'Full-scale utility networks, drainage, and foundational infrastructure setup.': 'Rrjete shërbimesh në shkallë të plotë, kullim dhe ngritja e infrastrukturës themelore.',
      'Underground Engineering & Infrastructure': 'Inxhinieria nëntokësore & infrastruktura',
      'CONSTRUCTION': 'NDËRTIM',
      'Structural Construction': 'Ndërtimi strukturor',
      'Robust framework building and heavy masonry works across all resort zones.': 'Ndërtim i fortë i skeletit dhe punime të rënda muratimi në të gjitha zonat e resort-it.',
      'CONSULTATION': 'KONSULTIM',
      'Ad Hoc Consultation': 'Konsultim ad hoc',
      'Tailored architectural adjustments and personal consultations for property owners.': 'Përshtatje arkitekturore të personalizuara dhe konsultime personale për pronarët.',
      '"Ad Hoc" Client Consultation': 'Konsultim "Ad Hoc" me klientin',
      'EXTERIOR': 'JASHTME',
      'Insulation & Facades': 'Izolimi & fasadat',
      'High-grade thermal insulation, exterior styling, and architectural facades.': 'Izolim termik cilësor, stilizim i jashtëm dhe fasada arkitekturore.',
      'Insulation and Exterior Facades': 'Izolimi dhe fasadat e jashtme',
      'LANDSCAPE': 'PEIZAZH',
      'Landscaping & Pools': 'Peizazhi & pishinat',
      'Creating lush outdoor environments, private pools, and final pathways.': 'Krijimi i mjediseve të jashtme të harlisura, pishinave private dhe shtigjeve përfundimtare.',
      'Landscaping, Private Pools, & Handover': 'Peizazhi, pishinat private & dorëzimi',
      'SUPPORT': 'MBËSHTETJE',
      'Post-Handover Support': 'Mbështetje pas dorëzimit',
      'Continuous maintenance, property management, and ongoing assistance after moving in.': 'Mirëmbajtje e vazhdueshme, menaxhim i pronës dhe ndihmë e vazhdueshme pas hyrjes në banesë.',
      'GET IN TOUCH': 'NA KONTAKTONI',
      'Contact us': 'Na kontaktoni',
      'First name': 'Emri',
      'Last name': 'Mbiemri',
      'Email': 'Email',
      'Phone': 'Telefoni',
      'Country': 'Shteti',
      'Message': 'Mesazhi',
      'I consent to my data being processed.': 'Jap pëlqimin që të dhënat e mia të përpunohen.',
      'Subscribe me to the newsletter.': 'Më regjistroni në buletin.',
      'SEND': 'DËRGO',
      'Receive the full dossier': 'Merr dosjen e plotë',
      'The Barkea Resort brochure — the project, residences and services — straight to your inbox.': 'Broshura e Barkea Resort — projekti, rezidencat dhe shërbimet — drejt e në email-in tuaj.',
      'BROCHURE': 'BROSHURA',
      'Resort is much more than an investment.': 'Resort-i është shumë më tepër se një investim.',
      'It\'s your move.': 'Radha është e jotja.',
      'WRITE TO US': 'SHKRUANI NE',
      'A World of Your Own': 'Një botë e jotja',
      'The Villas': 'Vilat',
      'A villa at Barkea is not simply a place to stay but a world that quietly becomes your own. Indoors and outdoors flow as one, open to gentle breezes, sunlight and the rhythm of nature, with every space inviting you to slow down, settle in and truly belong. All you have to do is arrive and let the resort take care of the rest.': 'Një vilë në Barkea nuk është thjesht një vend për të qëndruar, por një botë që bëhet qetësisht e jotja. Brendësia dhe jashtmja rrjedhin si një e vetme, të hapura ndaj flladit të lehtë, dritës së diellit dhe ritmit të natyrës, me çdo hapësirë që të fton të ngadalësosh, të vendosesh dhe të ndihesh vërtet në shtëpi. Gjithçka që duhet të bësh është të mbërrish dhe ta lësh resort-in të kujdeset për pjesën tjetër.',
      'Villas': 'Vila',
      'Completed': 'Përfunduar',
      'In progress': 'Në ndërtim',
      'Choose a series to browse its units, or explore all 37 below.': 'Zgjidh një seri për të shfletuar njësitë e saj, ose eksploro të 37-at më poshtë.',
      'Villa A Series': 'Seria Vila A',
      'Villa B Series': 'Seria Vila B',
      'Villa C Series': 'Seria Vila C',
      'Interior surface': 'Sipërfaqja e brendshme',
      'Land area': 'Sipërfaqja e tokës',
      'Layout': 'Planimetria',
      '2 or 3 floors': '2 ose 3 kate',
      'View A1–A8': 'Shiko A1–A8',
      '3 to 4 floors': '3 deri 4 kate',
      'View B1–B7': 'Shiko B1–B7',
      '3 floors + veranda': '3 kate + verandë',
      'View C1–C7': 'Shiko C1–C7',
      'Phase 1 — 15 completed villas.': 'Faza 1 — 15 vila të përfunduara.',
      'View completed': 'Shiko të përfunduarat',
      'Typology': 'Tipologjia',
      'All Units': 'Të gjitha njësitë',
      'Villa A Series (A1-A8)': 'Seria Vila A (A1-A8)',
      'Villa B Series (B1-B7)': 'Seria Vila B (B1-B7)',
      'Villa C Series (C1-C7)': 'Seria Vila C (C1-C7)',
      'Status': 'Statusi',
      'All Status': 'Të gjitha statuset',
      'In Progress': 'Në ndërtim',
      'Sold out': 'Të shitura',
      'Reset filter': 'Rivendos filtrin',
      'High-efficiency space optimization with modern minimal layouts.': 'Optimizim shumë efikas i hapësirës me planimetri moderne minimaliste.',
      'Optimized 2-floor structure focused on open-plan living and comfort.': 'Strukturë 2-katëshe e optimizuar, e fokusuar te jetesa me plan të hapur dhe rehatia.',
      'Mid-to-large scale luxury unit with massive plot expansions.': 'Njësi luksoze me përmasa të mesme deri të mëdha, me parcela shumë të gjera.',
      'Vast interior space featuring 4 full residential floors.': 'Hapësirë e gjerë e brendshme me 4 kate të plota banimi.',
      'Premium panorama unit overlooking the resort.': 'Njësi premium panoramike që shikon nga resort-i.',
      'Featuring massive 3rd-floor panoramic verandas.': 'Me veranda panoramike masive në katin e tretë.',
      'Fully completed residential villa with deep basement level.': 'Vilë rezidenciale plotësisht e përfunduar me nivel të thellë bodrumi.',
      'FLOOR PLAN': 'PLANIMETRIA',
      'Floor plan not available for this unit yet.': 'Planimetria nuk është ende e disponueshme për këtë njësi.',
      'Enquire about this villa': 'Kërko informacion për këtë vilë',
      'Architecture should speak of its time and place, but yearn for timelessness.': 'Arkitektura duhet të flasë për kohën dhe vendin e saj, por të synojë përjetësinë.',
      'ARCHITECTURE & MASTERPLAN': 'ARKITEKTURA & MASTERPLANI',
      'A HARMONIOUS BLEND OF FORM, FUNCTION, AND NATURE.': 'NJË PËRZIERJE HARMONIKE E FORMËS, FUNKSIONIT DHE NATYRËS.',
      'VILLA FLOOR PLANS': 'PLANIMETRITË E VILAVE',
      'EXPLORE THE INTERNAL CONFIGURATIONS AND LAYOUTS.': 'EKSPLORO KONFIGURIMET DHE PLANIMETRITË E BRENDSHME.',
      'TYPOLOGY A': 'TIPOLOGJIA A',
      'Villas A (206m² - 277m²)': 'Vilat A (206m² - 277m²)',
      'Divided into two main typologies (Typology 1 across 3 floors and Typology 2 across 2 floors), these residences offer thoughtfully organized living spaces featuring modern details and private zones.': 'Të ndara në dy tipologji kryesore (Tipologjia 1 në 3 kate dhe Tipologjia 2 në 2 kate), këto rezidenca ofrojnë hapësira jetese të organizuara me kujdes, me detaje moderne dhe zona private.',
      'Floor -1: Summer lounge, laundry, storage, and pool access.': 'Kati -1: Sallon veror, lavanderi, depo dhe qasje te pishina.',
      'Ground Floor: Main living area, open kitchen, and guest restroom.': 'Kati përdhes: Zona kryesore e ditës, kuzhinë e hapur dhe tualet për të ftuarit.',
      'First Floor: 3 bedrooms and dedicated bathrooms.': 'Kati i parë: 3 dhoma gjumi dhe banjo të dedikuara.',
      'TYPOLOGY B': 'TIPOLOGJIA B',
      'Villas B (426m² - 475m²)': 'Vilat B (426m² - 475m²)',
      'Villa B provides expansive, luxurious layouts spanning 3 or 4 levels, featuring technical rooms, grand dining areas, and summer lounges connected directly to the private pool deck.': 'Vila B ofron planimetri të gjera luksoze që shtrihen në 3 ose 4 nivele, me dhoma teknike, zona të mëdha ngrënieje dhe sallone verore të lidhura drejtpërdrejt me pishinën private.',
      'Spacious living and kitchen area up to 94m².': 'Zonë e gjerë ditore dhe kuzhine deri në 94m².',
      'South-west oriented balconies with panoramic views.': 'Ballkone të orientuara nga jugperëndimi me pamje panoramike.',
      'Luxurious master suite with walk-in wardrobe.': 'Suitë master luksoze me gardërobë walk-in.',
      'TYPOLOGY C': 'TIPOLOGJIA C',
      'Villas C (From 440m²)': 'Vilat C (Nga 440m²)',
      'Composed of two modules (C1 + C2) spread across multi-level tiers, these exclusive villas stand out for their grand panoramic verandas and sophisticated architectural zoning.': 'Të përbëra nga dy module (C1 + C2) të shtrira në nivele të shumëfishta, këto vila ekskluzive dallojnë për verandat e tyre madhështore panoramike dhe zonimin e sofistikuar arkitektonik.',
      'Modules C1 and C2 with entertainment and guest areas.': 'Modulet C1 dhe C2 me zona argëtimi dhe zona për të ftuarit.',
      'Expansive upper-floor panoramic veranda.': 'Verandë panoramike e gjerë në katin e sipërm.',
      'Direct fluid access to outdoor landscape zones.': 'Qasje e drejtpërdrejtë dhe e rrjedhshme te zonat e peizazhit të jashtëm.',
      'Frequently Asked Questions': 'Pyetje të shpeshta',
      'This page is being finalized. In the meantime, if you have a question about the Barkea Resort project — villas, pricing, timelines or the location — reach out directly and our team will answer you personally.': 'Kjo faqe po finalizohet. Ndërkohë, nëse keni një pyetje rreth projektit Barkea Resort — vilat, çmimet, afatet kohore ose vendndodhjen — na kontaktoni drejtpërdrejt dhe ekipi ynë do t\'ju përgjigjet personalisht.',
      'LEGAL': 'LIGJORE',
      'Legal Information': 'Informacione ligjore',
      'Our legal notices (company details, terms of use and disclosures) are being prepared and will be published here shortly. For any legal or contractual question in the meantime, please contact us directly.': 'Njoftimet tona ligjore (të dhënat e kompanisë, kushtet e përdorimit dhe shpalosjet) janë në përgatitje dhe do të publikohen këtu së shpejti. Për çdo pyetje ligjore ose kontraktuale ndërkohë, ju lutemi na kontaktoni drejtpërdrejt.',
      'Privacy Policy': 'Politika e privatësisë',
      'Last updated: September 2026': 'Përditësuar së fundi: shtator 2026',
      'This policy explains what personal data the Barkea Resort website collects, why, and what your rights are. It applies to this website and to the contact form on it.': 'Kjo politikë shpjegon çfarë të dhënash personale mbledh faqja e internetit e Barkea Resort, pse i mbledh dhe cilat janë të drejtat tuaja. Ajo zbatohet për këtë faqe interneti dhe për formularin e kontaktit në të.',
      '1. Who is responsible for your data': '1. Kush është përgjegjës për të dhënat tuaja',
      'The data controller is Dijon Albania, the developer of Barkea Resort. For any privacy question, write to info@dijonalbania.com .': 'Kontrolluesi i të dhënave është Dijon Albania, zhvilluesi i Barkea Resort. Për çdo pyetje mbi privatësinë, shkruani te info@dijonalbania.com .',
      '2. What we collect': '2. Çfarë mbledhim',
      'Contact form:': 'Formulari i kontaktit:',
      'first name, last name, email address, phone number, country and the message you write.': 'emri, mbiemri, adresa e email-it, numri i telefonit, shteti dhe mesazhi që shkruani.',
      'Your confirmations:': 'Konfirmimet tuaja:',
      'the consent checkbox on the form must be ticked before it can be sent.': 'kutia e pëlqimit në formular duhet të shënohet përpara se ai të dërgohet.',
      'Technical data:': 'Të dhëna teknike:',
      'like most websites, our server may record your IP address, browser type and the pages requested, for security and troubleshooting.': 'si shumica e faqeve të internetit, serveri ynë mund të regjistrojë adresën tuaj IP, llojin e shfletuesit dhe faqet e kërkuara, për siguri dhe zgjidhjen e problemeve.',
      'Browser storage:': 'Ruajtja në shfletues:',
      'the site stores your chosen language in your browser\'s local storage. It is not used to identify you.': 'faqja ruan gjuhën që keni zgjedhur në ruajtjen lokale të shfletuesit tuaj. Ajo nuk përdoret për t\'ju identifikuar.',
      '3. Why we use it': '3. Pse e përdorim',
      'To answer your enquiry and give you information about the villas and the project.': 'Për t\'iu përgjigjur kërkesës suaj dhe për t\'ju dhënë informacion rreth vilave dhe projektit.',
      'To keep the website secure and working properly.': 'Për ta mbajtur faqen të sigurt dhe që të funksionojë siç duhet.',
      'To meet legal obligations, where they apply.': 'Për të përmbushur detyrimet ligjore, kur zbatohen.',
      'We rely on your consent (the form checkbox) and on our legitimate interest in replying to people who contact us.': 'Mbështetemi te pëlqimi juaj (kutia e formularit) dhe te interesi ynë legjitim për t\'u përgjigjur personave që na kontaktojnë.',
      '4. Who can see it': '4. Kush mund t\'i shohë',
      'Your message is visible to the Barkea Resort sales team and to the service providers who host and maintain this website, only as far as they need it to do their job. We do not sell your data. Embedded third-party content on the site (for example maps or the 3D masterplan viewer) is loaded from its provider, which may receive your IP address and set its own cookies under its own policy.': 'Mesazhi juaj është i dukshëm për ekipin e shitjeve të Barkea Resort dhe për ofruesit e shërbimeve që strehojnë dhe mirëmbajnë këtë faqe, vetëm për aq sa u nevojitet për të kryer punën e tyre. Ne nuk i shesim të dhënat tuaja. Përmbajtja e palëve të treta e integruar në faqe (për shembull hartat ose shikuesi 3D i masterplanit) ngarkohet nga ofruesi i saj, i cili mund të marrë adresën tuaj IP dhe të vendosë cookie-t e veta sipas politikës së tij.',
      '5. How long we keep it': '5. Sa gjatë i ruajmë',
      'We keep your enquiry for as long as needed to handle it and follow up, and no longer than 24months after our last contact, unless the law requires longer.': 'Kërkesën tuaj e ruajmë për aq kohë sa nevojitet për ta trajtuar dhe për ta ndjekur, dhe jo më gjatë se 24 muaj pas kontaktit tonë të fundit, përveç nëse ligji kërkon më shumë.',
      '6. Your rights': '6. Të drejtat tuaja',
      'Under applicable data-protection law (including Albanian data-protection legislation and, where it applies to you, the GDPR), you can ask us to:': 'Sipas ligjit në fuqi për mbrojtjen e të dhënave (përfshirë legjislacionin shqiptar për mbrojtjen e të dhënave dhe, kur zbatohet për ju, GDPR), mund të na kërkoni:',
      'give you a copy of your data and correct anything inaccurate;': 't\'ju japim një kopje të të dhënave tuaja dhe të korrigjojmë çdo gjë të pasaktë;',
      'delete your data or restrict how we use it;': 'të fshijmë të dhënat tuaja ose të kufizojmë mënyrën si i përdorim;',
      'stop using it where we rely on legitimate interest;': 'të pushojmë përdorimin e tyre kur mbështetemi te interesi legjitim;',
      'withdraw your consent at any time, without affecting what we did before you withdrew it.': 'të tërhiqni pëlqimin tuaj në çdo kohë, pa cenuar atë që kemi bërë para tërheqjes së tij.',
      'Email barkealbania@gmail.com to use any of these rights. You may also complain to the data-protection authority in your country.': 'Dërgoni email te barkealbania@gmail.com për të ushtruar cilëndo nga këto të drejta. Mund të bëni ankesë edhe te autoriteti i mbrojtjes së të dhënave në vendin tuaj.',
      '7. Security': '7. Siguria',
      'We use reasonable technical and organisational measures to protect your data. No online service can be guaranteed completely secure, so please do not include sensitive information in the message field.': 'Përdorim masa teknike dhe organizative të arsyeshme për të mbrojtur të dhënat tuaja. Asnjë shërbim online nuk mund të garantohet plotësisht i sigurt, prandaj ju lutemi mos përfshini informacione të ndjeshme në fushën e mesazhit.',
      '8. Changes to this policy': '8. Ndryshimet në këtë politikë',
      'If we change how we handle personal data we will update this page and its date.': 'Nëse ndryshojmë mënyrën si i trajtojmë të dhënat personale, do ta përditësojmë këtë faqe dhe datën e saj.',
      'Residence & living — Farke, Tirana': 'Rezidencë & jetesë — Farke, Tiranë',
      'CONTACT': 'KONTAKT',
      'Lunder, Farke-Tirana': 'Lunder, Farke-Tiranë',
      'NEWSLETTER': 'BULETINI',
      'Brochure': 'Broshura',
      'Legal': 'Ligjore',
      'Privacy': 'Privatësia',
      '© 2026 Barkea Resort. All rights reserved. Non-contractual information.': '© 2026 Barkea Resort. Të gjitha të drejtat e rezervuara. Informacion jo kontraktual.',
      'Please tick the required consent checkbox before submitting the form.': 'Ju lutemi shënoni kutinë e detyrueshme të pëlqimit përpara se ta dërgoni formularin.',
      'SENDING...': 'DUKE DËRGUAR...',
      'Thank you — your message has been sent. We will be in touch shortly.': 'Faleminderit — mesazhi juaj u dërgua. Do t\'ju kontaktojmë së shpejti.',
      'Something went wrong sending your message. Please try again or email us directly.': 'Diçka shkoi keq gjatë dërgimit të mesazhit. Ju lutemi provoni përsëri ose na shkruani drejtpërdrejt me email.',
      'Construction progress': 'Ecuria e ndërtimit',
      '15 of 37 villas completed': '15 nga 37 vila të përfunduara'
    },
    it: {
      'PROPERTY': 'PROPRIETÀ',
      'PARTNERS': 'PARTNER',
      'SALES': 'VENDITE',
      'OPERATIONS': 'OPERAZIONI',
      'RESIDENTIAL ESTATE': 'COMPLESSO RESIDENZIALE',
      'DISCOVER': 'SCOPRI',
      'LOCATION': 'POSIZIONE',
      'Lunder, Farke — close enough, quiet enough.': 'Lunder, Farke — abbastanza vicino, abbastanza tranquillo.',
      'Southeast of Tirana, the Lunder–Farke area has become one of the capital\'s defining residential zones: greener and calmer than the centre, with a fast, direct connection back into the city.': 'A sud-est di Tirana, l\'area di Lunder–Farke è diventata una delle zone residenziali più rappresentative della capitale: più verde e tranquilla del centro, con un collegamento rapido e diretto con la città.',
      'Driving distance': 'Distanza in auto',
      'to central Tirana': 'dal centro di Tirana',
      'SE': 'SE',
      'Positioned': 'Posizionato',
      'in the southeast growth corridor': 'nel corridoio di crescita a sud-est',
      'Low': 'Bassa',
      'Building density': 'Densità edilizia',
      'relative to central neighbourhoods': 'rispetto ai quartieri centrali',
      'High': 'Alta',
      'Green cover': 'Copertura verde',
      'and residential character': 'e carattere residenziale',
      'GALLERY': 'GALLERIA',
      'The project in images': 'Il progetto in immagini',
      'SWIPE TO EXPLORE': 'SCORRI PER ESPLORARE',
      'The Concept': 'Il Concetto',
      'A new standard of luxury living': 'Un nuovo standard di vita di lusso',
      'Barkea Resort redefines elegance by harmonizing with the serene natural beauty of Farka. Every detail is crafted to offer a lifestyle of absolute privacy, comfort, and sophistication.': 'Barkea Resort ridefinisce l\'eleganza armonizzandosi con la serena bellezza naturale di Farka. Ogni dettaglio è curato per offrire uno stile di vita di assoluta privacy, comfort e raffinatezza.',
      'A residential complex built around a single idea:': 'Un complesso residenziale costruito attorno a un\'unica idea:',
      'proximity without density.': 'vicinanza senza densità.',
      'Our villas are thoughtfully designed to maximize natural light and seamless indoor-outdoor living. Positioned perfectly along the terrain, each residence guarantees panoramic views, total independence, and a deep connection with the surrounding landscape.': 'Le nostre ville sono progettate con cura per massimizzare la luce naturale e la continuità tra interni ed esterni. Posizionata perfettamente lungo il terreno, ogni residenza garantisce viste panoramiche, totale indipendenza e un profondo legame con il paesaggio circostante.',
      '“A place to live first, an investment second.”': '“Un luogo in cui vivere prima di tutto, un investimento poi.”',
      'THE RESORT COMPLEX': 'IL COMPLESSO RESORT',
      'Six rows, thirty-seven villas.': 'Sei file, trentasette ville.',
      'The complex is organised into six linear rows of villas. Each row follows the same architectural principles — massing, materials, roof lines — while individual plots, verandas and outdoor areas vary by position and typology.': 'Il complesso è organizzato in sei file lineari di ville. Ogni fila segue gli stessi principi architettonici — volumi, materiali, linee del tetto — mentre i singoli lotti, le verande e gli spazi esterni variano in base alla posizione e alla tipologia.',
      'click to see...': 'clicca per vedere...',
      'Villas & Categories': 'Ville e Categorie',
      'Villa A': 'Villa A',
      'Villa B': 'Villa B',
      'Villa C': 'Villa C',
      'Villa': 'Villa',
      'Exclusive residences blending modern comfort with nature.': 'Residenze esclusive che fondono comfort moderno e natura.',
      'INTERIOR SURFACE': 'SUPERFICIE INTERNA',
      'LAND AREA': 'SUPERFICIE DEL LOTTO',
      'Available in 2 or 3-story layouts (A1-A8) featuring optimized modern interiors, private pool, storage, and outdoor entertainment areas.': 'Disponibili con distribuzioni su 2 o 3 piani (A1-A8), con interni moderni ottimizzati, piscina privata, ripostigli e aree di svago all\'aperto.',
      'See more...': 'Scopri di più...',
      'Spacious luxury residences designed for ultimate comfort.': 'Residenze di lusso spaziose progettate per il massimo comfort.',
      'Offering 3 to 4-story layouts (B1-B7) with large private plots, professional modern design, private pool, and outdoor amenities.': 'Offrono distribuzioni da 3 a 4 piani (B1-B7) con ampi lotti privati, design moderno professionale, piscina privata e servizi all\'aperto.',
      'Modern architecture with panoramic views and refined luxury.': 'Architettura moderna con viste panoramiche e lusso raffinato.',
      '3-story structures (C1-C7) featuring specialized top-floor layouts with panoramic verandas overlooking the entire complex, plus private pool and leisure spaces.': 'Strutture a 3 piani (C1-C7) con distribuzioni speciali all\'ultimo piano, con verande panoramiche che dominano l\'intero complesso, oltre a piscina privata e spazi relax.',
      'Customizable luxury residences with tailored ad hoc layouts.': 'Residenze di lusso personalizzabili con distribuzioni su misura ad hoc.',
      'Featuring 3 floors and 1 underground level with private verandas and individual parking. Designed with a unified architectural style while allowing clients to customize spaces ad hoc.': 'Con 3 piani e 1 livello interrato, verande private e parcheggio individuale. Progettate con uno stile architettonico unitario, consentendo ai clienti di personalizzare gli spazi ad hoc.',
      'Architecture & Masterplan': 'Architettura e Masterplan',
      'A harmonious blend of form, function, and nature.': 'Un\'armoniosa fusione di forma, funzione e natura.',
      'MASTERPLAN CONCEPT': 'CONCEPT DEL MASTERPLAN',
      'Integrated Terrain & Smart Zoning': 'Terreno integrato e zonizzazione intelligente',
      'The architectural masterplan is carefully designed to follow the natural topography of the land. Every villa position is optimized to guarantee maximum privacy, unobstructed panoramic views, and seamless connection with lush green environments and recreational zones.': 'Il masterplan architettonico è progettato con cura per seguire la topografia naturale del terreno. Ogni posizione di villa è ottimizzata per garantire la massima privacy, viste panoramiche senza ostacoli e un collegamento continuo con ambienti verdi e zone ricreative.',
      'Optimal sun orientation for every residence': 'Orientamento solare ottimale per ogni residenza',
      'Private access roads and dedicated parking zones': 'Strade di accesso private e aree di parcheggio dedicate',
      'Extensive green corridors and community spaces': 'Ampi corridoi verdi e spazi comuni',
      'CLICK TO SEE LARGER': 'CLICCA PER INGRANDIRE',
      'ON SITE': 'IN LOCO',
      'Why Barkea Resort': 'Perché Barkea Resort',
      'Privileged Location': 'Posizione privilegiata',
      'Just 8 km from Tirana in a peaceful, well-connected green zone.': 'A soli 8 km da Tirana, in una zona verde tranquilla e ben collegata.',
      'Privacy & Greenery': 'Privacy e verde',
      'Only 37 private villas with large plots for absolute privacy.': 'Solo 37 ville private con ampi lotti per una privacy assoluta.',
      'Exclusive Design': 'Design esclusivo',
      'Modern architecture featuring large glass facades and top standards.': 'Architettura moderna con ampie facciate in vetro e standard elevati.',
      'Ad Hoc Flexibility': 'Flessibilità ad hoc',
      'Fully customizable interiors tailored to your preferences.': 'Interni completamente personalizzabili in base alle tue preferenze.',
      'Secure Investment': 'Investimento sicuro',
      'An elite area guaranteeing strong long-term property value growth.': 'Una zona esclusiva che garantisce una solida crescita del valore dell\'immobile nel lungo termine.',
      'Private Pools': 'Piscine private',
      'Spacious private yards designed for your own swimming pool.': 'Ampi giardini privati progettati per la tua piscina.',
      'Recreation & Leisure': 'Svago e relax',
      'Safe, gated community with 24/7 security and scenic walkways.': 'Comunità sicura e recintata con sicurezza 24/7 e percorsi panoramici.',
      'SCROLL TO EXPLORE': 'SCORRI PER ESPLORARE',
      'The developer': 'Lo sviluppatore',
      'is the developer of Barkea Resort — the company behind the project.': 'è lo sviluppatore di Barkea Resort — la società dietro il progetto.',
      'The circle maps the phases of the project: site selection and master planning, underground engineering and infrastructure, structural construction, insulation and exterior facades, and landscaping, private pools and handover — with owner support, ad hoc client consultation and post-handover support alongside.The project has progressed through these phases: on the Villas page, the 15 Phase 1 units are marked Completed and the 22 villas of the A, B and C series In Progress — 37 villas in total. Select a phase in the circle to see what it covers.': 'Il cerchio mappa le fasi del progetto: scelta del sito e masterplanning, ingegneria sotterranea e infrastrutture, costruzione strutturale, isolamento e facciate esterne, e paesaggistica, piscine private e consegna — con assistenza ai proprietari, consulenza ad hoc per i clienti e supporto post-consegna. Il progetto è avanzato attraverso queste fasi: nella pagina Ville, le 15 unità della Fase 1 sono contrassegnate come Completate e le 22 ville delle serie A, B e C come In corso — 37 ville in totale. Seleziona una fase nel cerchio per vedere cosa comprende.',
      'CONCIERGE': 'CONCIERGE',
      'Owner support': 'Assistenza ai proprietari',
      'A dedicated contact who knows your residence at Barkea and follows you over time.': 'Un referente dedicato che conosce la tua residenza a Barkea e ti segue nel tempo.',
      'Owner Support': 'Assistenza ai proprietari',
      'PLANNING': 'PIANIFICAZIONE',
      'Site Selection & Master Planning': 'Scelta del sito e masterplanning',
      'Strategic placement and architectural blueprint design managed by Dijon & team.': 'Posizionamento strategico e progettazione architettonica gestiti da Dijon e dal team.',
      'INFRASTRUCTURE': 'INFRASTRUTTURE',
      'Underground Engineering': 'Ingegneria sotterranea',
      'Full-scale utility networks, drainage, and foundational infrastructure setup.': 'Reti di servizi su larga scala, drenaggio e realizzazione delle infrastrutture di base.',
      'Underground Engineering & Infrastructure': 'Ingegneria sotterranea e infrastrutture',
      'CONSTRUCTION': 'COSTRUZIONE',
      'Structural Construction': 'Costruzione strutturale',
      'Robust framework building and heavy masonry works across all resort zones.': 'Realizzazione di strutture robuste e opere murarie pesanti in tutte le zone del resort.',
      'CONSULTATION': 'CONSULENZA',
      'Ad Hoc Consultation': 'Consulenza ad hoc',
      'Tailored architectural adjustments and personal consultations for property owners.': 'Adattamenti architettonici su misura e consulenze personali per i proprietari.',
      '"Ad Hoc" Client Consultation': 'Consulenza "Ad Hoc" per il cliente',
      'EXTERIOR': 'ESTERNI',
      'Insulation & Facades': 'Isolamento e facciate',
      'High-grade thermal insulation, exterior styling, and architectural facades.': 'Isolamento termico di alta qualità, stile esterno e facciate architettoniche.',
      'Insulation and Exterior Facades': 'Isolamento e facciate esterne',
      'LANDSCAPE': 'PAESAGGIO',
      'Landscaping & Pools': 'Paesaggistica e piscine',
      'Creating lush outdoor environments, private pools, and final pathways.': 'Creazione di rigogliosi ambienti esterni, piscine private e percorsi finali.',
      'Landscaping, Private Pools, & Handover': 'Paesaggistica, piscine private e consegna',
      'SUPPORT': 'ASSISTENZA',
      'Post-Handover Support': 'Assistenza post-consegna',
      'Continuous maintenance, property management, and ongoing assistance after moving in.': 'Manutenzione continua, gestione dell\'immobile e assistenza costante dopo il trasferimento.',
      'GET IN TOUCH': 'CONTATTACI',
      'Contact us': 'Contattaci',
      'First name': 'Nome',
      'Last name': 'Cognome',
      'Email': 'Email',
      'Phone': 'Telefono',
      'Country': 'Paese',
      'Message': 'Messaggio',
      'I consent to my data being processed.': 'Acconsento al trattamento dei miei dati.',
      'Subscribe me to the newsletter.': 'Iscrivimi alla newsletter.',
      'SEND': 'INVIA',
      'Receive the full dossier': 'Ricevi il dossier completo',
      'The Barkea Resort brochure — the project, residences and services — straight to your inbox.': 'La brochure di Barkea Resort — il progetto, le residenze e i servizi — direttamente nella tua casella di posta.',
      'BROCHURE': 'BROCHURE',
      'Resort is much more than an investment.': 'Il resort è molto più di un investimento.',
      'It\'s your move.': 'Tocca a te.',
      'WRITE TO US': 'SCRIVICI',
      'A World of Your Own': 'Un mondo tutto tuo',
      'The Villas': 'Le Ville',
      'A villa at Barkea is not simply a place to stay but a world that quietly becomes your own. Indoors and outdoors flow as one, open to gentle breezes, sunlight and the rhythm of nature, with every space inviting you to slow down, settle in and truly belong. All you have to do is arrive and let the resort take care of the rest.': 'Una villa a Barkea non è semplicemente un posto dove soggiornare, ma un mondo che diventa silenziosamente tuo. Interni ed esterni scorrono come un tutt\'uno, aperti alle brezze leggere, alla luce del sole e al ritmo della natura, con ogni spazio che invita a rallentare, sentirsi a casa e appartenere davvero. Tutto ciò che devi fare è arrivare e lasciare che sia il resort a occuparsi del resto.',
      'Villas': 'Ville',
      'Completed': 'Completate',
      'In progress': 'In corso',
      'Choose a series to browse its units, or explore all 37 below.': 'Scegli una serie per sfogliare le sue unità, oppure esplora tutte le 37 qui sotto.',
      'Villa A Series': 'Serie Villa A',
      'Villa B Series': 'Serie Villa B',
      'Villa C Series': 'Serie Villa C',
      'Interior surface': 'Superficie interna',
      'Land area': 'Superficie del lotto',
      'Layout': 'Distribuzione',
      '2 or 3 floors': '2 o 3 piani',
      'View A1–A8': 'Vedi A1–A8',
      '3 to 4 floors': 'Da 3 a 4 piani',
      'View B1–B7': 'Vedi B1–B7',
      '3 floors + veranda': '3 piani + veranda',
      'View C1–C7': 'Vedi C1–C7',
      'Phase 1 — 15 completed villas.': 'Fase 1 — 15 ville completate.',
      'View completed': 'Vedi le completate',
      'Typology': 'Tipologia',
      'All Units': 'Tutte le unità',
      'Villa A Series (A1-A8)': 'Serie Villa A (A1-A8)',
      'Villa B Series (B1-B7)': 'Serie Villa B (B1-B7)',
      'Villa C Series (C1-C7)': 'Serie Villa C (C1-C7)',
      'Status': 'Stato',
      'All Status': 'Tutti gli stati',
      'In Progress': 'In corso',
      'Sold out': 'Esaurite',
      'Reset filter': 'Reimposta filtro',
      'High-efficiency space optimization with modern minimal layouts.': 'Ottimizzazione degli spazi ad alta efficienza con distribuzioni moderne e minimali.',
      'Optimized 2-floor structure focused on open-plan living and comfort.': 'Struttura ottimizzata su 2 piani, incentrata su vita open space e comfort.',
      'Mid-to-large scale luxury unit with massive plot expansions.': 'Unità di lusso di dimensioni medio-grandi con ampi lotti.',
      'Vast interior space featuring 4 full residential floors.': 'Ampio spazio interno con 4 piani residenziali completi.',
      'Premium panorama unit overlooking the resort.': 'Unità premium panoramica con vista sul resort.',
      'Featuring massive 3rd-floor panoramic verandas.': 'Con grandi verande panoramiche al terzo piano.',
      'Fully completed residential villa with deep basement level.': 'Villa residenziale completamente ultimata con ampio livello interrato.',
      'FLOOR PLAN': 'PLANIMETRIA',
      'Floor plan not available for this unit yet.': 'La planimetria non è ancora disponibile per questa unità.',
      'Enquire about this villa': 'Richiedi informazioni su questa villa',
      'Architecture should speak of its time and place, but yearn for timelessness.': 'L\'architettura dovrebbe parlare del proprio tempo e luogo, ma aspirare all\'atemporalità.',
      'ARCHITECTURE & MASTERPLAN': 'ARCHITETTURA E MASTERPLAN',
      'A HARMONIOUS BLEND OF FORM, FUNCTION, AND NATURE.': 'UN\'ARMONIOSA FUSIONE DI FORMA, FUNZIONE E NATURA.',
      'VILLA FLOOR PLANS': 'PLANIMETRIE DELLE VILLE',
      'EXPLORE THE INTERNAL CONFIGURATIONS AND LAYOUTS.': 'ESPLORA LE CONFIGURAZIONI E LE DISTRIBUZIONI INTERNE.',
      'TYPOLOGY A': 'TIPOLOGIA A',
      'Villas A (206m² - 277m²)': 'Ville A (206m² - 277m²)',
      'Divided into two main typologies (Typology 1 across 3 floors and Typology 2 across 2 floors), these residences offer thoughtfully organized living spaces featuring modern details and private zones.': 'Suddivise in due tipologie principali (Tipologia 1 su 3 piani e Tipologia 2 su 2 piani), queste residenze offrono spazi abitativi organizzati con cura, con dettagli moderni e zone private.',
      'Floor -1: Summer lounge, laundry, storage, and pool access.': 'Piano -1: Lounge estiva, lavanderia, ripostiglio e accesso alla piscina.',
      'Ground Floor: Main living area, open kitchen, and guest restroom.': 'Piano terra: Zona giorno principale, cucina a vista e bagno per gli ospiti.',
      'First Floor: 3 bedrooms and dedicated bathrooms.': 'Primo piano: 3 camere da letto e bagni dedicati.',
      'TYPOLOGY B': 'TIPOLOGIA B',
      'Villas B (426m² - 475m²)': 'Ville B (426m² - 475m²)',
      'Villa B provides expansive, luxurious layouts spanning 3 or 4 levels, featuring technical rooms, grand dining areas, and summer lounges connected directly to the private pool deck.': 'La Villa B offre ampie distribuzioni di lusso su 3 o 4 livelli, con locali tecnici, grandi zone pranzo e lounge estive collegate direttamente alla terrazza della piscina privata.',
      'Spacious living and kitchen area up to 94m².': 'Ampia zona giorno e cucina fino a 94m².',
      'South-west oriented balconies with panoramic views.': 'Balconi orientati a sud-ovest con vista panoramica.',
      'Luxurious master suite with walk-in wardrobe.': 'Suite padronale di lusso con cabina armadio.',
      'TYPOLOGY C': 'TIPOLOGIA C',
      'Villas C (From 440m²)': 'Ville C (Da 440m²)',
      'Composed of two modules (C1 + C2) spread across multi-level tiers, these exclusive villas stand out for their grand panoramic verandas and sophisticated architectural zoning.': 'Composte da due moduli (C1 + C2) distribuiti su più livelli, queste ville esclusive si distinguono per le grandiose verande panoramiche e la sofisticata zonizzazione architettonica.',
      'Modules C1 and C2 with entertainment and guest areas.': 'Moduli C1 e C2 con aree di intrattenimento e per gli ospiti.',
      'Expansive upper-floor panoramic veranda.': 'Ampia veranda panoramica al piano superiore.',
      'Direct fluid access to outdoor landscape zones.': 'Accesso diretto e fluido alle aree paesaggistiche esterne.',
      'Frequently Asked Questions': 'Domande frequenti',
      'This page is being finalized. In the meantime, if you have a question about the Barkea Resort project — villas, pricing, timelines or the location — reach out directly and our team will answer you personally.': 'Questa pagina è in fase di completamento. Nel frattempo, se hai una domanda sul progetto Barkea Resort — ville, prezzi, tempistiche o posizione — contattaci direttamente e il nostro team ti risponderà personalmente.',
      'LEGAL': 'LEGALE',
      'Legal Information': 'Informazioni legali',
      'Our legal notices (company details, terms of use and disclosures) are being prepared and will be published here shortly. For any legal or contractual question in the meantime, please contact us directly.': 'Le nostre informative legali (dati societari, condizioni d\'uso e informative) sono in preparazione e saranno pubblicate qui a breve. Per qualsiasi domanda legale o contrattuale nel frattempo, ti preghiamo di contattarci direttamente.',
      'Privacy Policy': 'Informativa sulla privacy',
      'Last updated: September 2026': 'Ultimo aggiornamento: settembre 2026',
      'This policy explains what personal data the Barkea Resort website collects, why, and what your rights are. It applies to this website and to the contact form on it.': 'Questa informativa spiega quali dati personali raccoglie il sito web di Barkea Resort, perché li raccoglie e quali sono i tuoi diritti. Si applica a questo sito e al modulo di contatto presente al suo interno.',
      '1. Who is responsible for your data': '1. Chi è responsabile dei tuoi dati',
      'The data controller is Dijon Albania, the developer of Barkea Resort. For any privacy question, write to info@dijonalbania.com .': 'Il titolare del trattamento è Dijon Albania, lo sviluppatore di Barkea Resort. Per qualsiasi domanda sulla privacy, scrivi a info@dijonalbania.com .',
      '2. What we collect': '2. Cosa raccogliamo',
      'Contact form:': 'Modulo di contatto:',
      'first name, last name, email address, phone number, country and the message you write.': 'nome, cognome, indirizzo email, numero di telefono, paese e il messaggio che scrivi.',
      'Your confirmations:': 'Le tue conferme:',
      'the consent checkbox on the form must be ticked before it can be sent.': 'la casella di consenso nel modulo deve essere selezionata prima dell\'invio.',
      'Technical data:': 'Dati tecnici:',
      'like most websites, our server may record your IP address, browser type and the pages requested, for security and troubleshooting.': 'come la maggior parte dei siti web, il nostro server può registrare il tuo indirizzo IP, il tipo di browser e le pagine richieste, per sicurezza e risoluzione dei problemi.',
      'Browser storage:': 'Archiviazione del browser:',
      'the site stores your chosen language in your browser\'s local storage. It is not used to identify you.': 'il sito memorizza la lingua scelta nella memoria locale del tuo browser. Non viene utilizzata per identificarti.',
      '3. Why we use it': '3. Perché li utilizziamo',
      'To answer your enquiry and give you information about the villas and the project.': 'Per rispondere alla tua richiesta e fornirti informazioni sulle ville e sul progetto.',
      'To keep the website secure and working properly.': 'Per mantenere il sito sicuro e funzionante.',
      'To meet legal obligations, where they apply.': 'Per adempiere agli obblighi di legge, ove applicabili.',
      'We rely on your consent (the form checkbox) and on our legitimate interest in replying to people who contact us.': 'Ci basiamo sul tuo consenso (la casella del modulo) e sul nostro legittimo interesse a rispondere a chi ci contatta.',
      '4. Who can see it': '4. Chi può vederli',
      'Your message is visible to the Barkea Resort sales team and to the service providers who host and maintain this website, only as far as they need it to do their job. We do not sell your data. Embedded third-party content on the site (for example maps or the 3D masterplan viewer) is loaded from its provider, which may receive your IP address and set its own cookies under its own policy.': 'Il tuo messaggio è visibile al team vendite di Barkea Resort e ai fornitori di servizi che ospitano e mantengono questo sito, solo nella misura necessaria allo svolgimento del loro lavoro. Non vendiamo i tuoi dati. I contenuti di terze parti incorporati nel sito (ad esempio le mappe o il visualizzatore 3D del masterplan) vengono caricati dal rispettivo fornitore, che può ricevere il tuo indirizzo IP e impostare propri cookie secondo la propria informativa.',
      '5. How long we keep it': '5. Per quanto tempo li conserviamo',
      'We keep your enquiry for as long as needed to handle it and follow up, and no longer than 24months after our last contact, unless the law requires longer.': 'Conserviamo la tua richiesta per il tempo necessario a gestirla e darvi seguito, e non oltre 24 mesi dall\'ultimo contatto, salvo che la legge richieda un periodo più lungo.',
      '6. Your rights': '6. I tuoi diritti',
      'Under applicable data-protection law (including Albanian data-protection legislation and, where it applies to you, the GDPR), you can ask us to:': 'Ai sensi della normativa applicabile in materia di protezione dei dati (inclusa la legislazione albanese sulla protezione dei dati e, ove applicabile, il GDPR), puoi chiederci di:',
      'give you a copy of your data and correct anything inaccurate;': 'fornirti una copia dei tuoi dati e correggere eventuali inesattezze;',
      'delete your data or restrict how we use it;': 'cancellare i tuoi dati o limitarne l\'utilizzo;',
      'stop using it where we rely on legitimate interest;': 'smettere di utilizzarli quando ci basiamo sul legittimo interesse;',
      'withdraw your consent at any time, without affecting what we did before you withdrew it.': 'revocare il tuo consenso in qualsiasi momento, senza pregiudicare quanto fatto prima della revoca.',
      'Email barkealbania@gmail.com to use any of these rights. You may also complain to the data-protection authority in your country.': 'Scrivi a barkealbania@gmail.com per esercitare uno qualsiasi di questi diritti. Puoi anche presentare reclamo all\'autorità per la protezione dei dati del tuo paese.',
      '7. Security': '7. Sicurezza',
      'We use reasonable technical and organisational measures to protect your data. No online service can be guaranteed completely secure, so please do not include sensitive information in the message field.': 'Utilizziamo misure tecniche e organizzative ragionevoli per proteggere i tuoi dati. Nessun servizio online può essere garantito come completamente sicuro, pertanto ti preghiamo di non inserire informazioni sensibili nel campo del messaggio.',
      '8. Changes to this policy': '8. Modifiche alla presente informativa',
      'If we change how we handle personal data we will update this page and its date.': 'Se modifichiamo il modo in cui trattiamo i dati personali, aggiorneremo questa pagina e la sua data.',
      'Residence & living — Farke, Tirana': 'Residenza e vita — Farke, Tirana',
      'CONTACT': 'CONTATTI',
      'Lunder, Farke-Tirana': 'Lunder, Farke-Tirana',
      'NEWSLETTER': 'NEWSLETTER',
      'Brochure': 'Brochure',
      'Legal': 'Legale',
      'Privacy': 'Privacy',
      '© 2026 Barkea Resort. All rights reserved. Non-contractual information.': '© 2026 Barkea Resort. Tutti i diritti riservati. Informazioni non contrattuali.',
      'Please tick the required consent checkbox before submitting the form.': 'Seleziona la casella di consenso obbligatoria prima di inviare il modulo.',
      'SENDING...': 'INVIO IN CORSO...',
      'Thank you — your message has been sent. We will be in touch shortly.': 'Grazie — il tuo messaggio è stato inviato. Ti contatteremo a breve.',
      'Something went wrong sending your message. Please try again or email us directly.': 'Si è verificato un problema durante l\'invio del messaggio. Riprova oppure scrivici direttamente via email.',
      'Construction progress': 'Avanzamento dei lavori',
      '15 of 37 villas completed': '15 ville su 37 completate'
    }
  };

  const CONTENT_REV = {};
  Object.keys(CONTENT_I18N).forEach(function (code) {
    Object.keys(CONTENT_I18N[code]).forEach(function (en) {
      if (CONTENT_I18N[code][en] !== en) CONTENT_REV[CONTENT_I18N[code][en]] = en;
    });
  });

  const CONTENT_CARD_TOKENS = {
    al: [['Villa', 'Vila'], ['Phase', 'Faza'], ['Unit', 'Njësia'], ['Floors', 'Kate'], ['Basement', 'Bodrum'], ['Veranda', 'Verandë'], ['Open-plan', 'Plan i hapur'], ['Vast Interior', 'Brendësi e gjerë']],
    it: [['Villa', 'Villa'], ['Phase', 'Fase'], ['Unit', 'Unità'], ['Floors', 'Piani'], ['Basement', 'Interrato'], ['Veranda', 'Veranda'], ['Open-plan', 'Open space'], ['Vast Interior', 'Ampi interni']]
  };

  const CONTENT_MESSAGES = {
    al: {
      found: function (n) { return n === 1 ? '1 njësi e gjetur' : n + ' njësi të gjetura'; },
      required: function (label) { return 'Fusha "' + label + '" është e detyrueshme.'; },
      invalid: function (label) { return 'Ju lutemi shkruani një vlerë të vlefshme për "' + label.toLowerCase() + '".'; }
    },
    it: {
      found: function (n) { return n === 1 ? '1 unità trovata' : n + ' unità trovate'; },
      required: function (label) { return 'Il campo "' + label + '" è obbligatorio.'; },
      invalid: function (label) { return 'Inserisci un valore valido per "' + label.toLowerCase() + '".'; }
    }
  };

  const contentNodes = new WeakMap();
  let contentLang = 'en';

  function lookupContent(key, lang) {
    const dict = CONTENT_I18N[lang];
    if (!dict) return null;
    if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];

    const messages = CONTENT_MESSAGES[lang];
    let match = key.match(/^(\d+) units? found$/);
    if (match) return messages.found(Number(match[1]));

    match = key.match(/^(.+) is required\.$/);
    if (match && dict[match[1]]) return messages.required(dict[match[1]]);

    match = key.match(/^Please enter a valid (.+)\.$/);
    if (match) {
      const label = dict[match[1].charAt(0).toUpperCase() + match[1].slice(1)];
      if (label) return messages.invalid(label);
    }

    if (/^(Villa [ABC]\d|Phase 1)( |$)/.test(key)) {
      return CONTENT_CARD_TOKENS[lang].reduce(function (text, pair) {
        return text.replace(new RegExp('\\b' + pair[0] + '\\b', 'g'), pair[1]);
      }, key);
    }
    return null;
  }

  function translateContentNode(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest('header, script, style, textarea')) return;

    const record = contentNodes.get(node);
    const source = record && record.out === node.nodeValue ? record.src : node.nodeValue;
    const key = source.replace(/\s+/g, ' ').trim();
    if (!key) return;

    const english = Object.prototype.hasOwnProperty.call(CONTENT_I18N.al, key) ? key : (CONTENT_REV[key] || key);
    const translated = contentLang === 'en' ? null : lookupContent(english, contentLang);
    const lead = source.match(/^\s*/)[0];
    const trail = source.match(/\s*$/)[0];

    let out = source;
    if (translated) out = lead + translated + trail;
    else if (english !== key) out = lead + english + trail;

    if (out !== node.nodeValue) node.nodeValue = out;
    contentNodes.set(node, { src: source, out: out });
  }

  function walkContentNodes(root) {
    if (root.nodeType === 3) { translateContentNode(root); return; }
    if (root.nodeType !== 1) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateContentNode);
  }

  function applyContentLanguage(lang) {
    contentLang = CONTENT_I18N[lang] ? lang : 'en';
    document.documentElement.lang = contentLang === 'al' ? 'sq' : contentLang;
    walkContentNodes(document.body);
  }

  new MutationObserver(function (mutations) {
    if (contentLang === 'en') return;
    mutations.forEach(function (mutation) {
      if (mutation.type === 'characterData') translateContentNode(mutation.target);
      else mutation.addedNodes.forEach(walkContentNodes);
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });

  const navLangLabel = document.getElementById('navLangLabel');

  function applyNavLanguage(lang) {
    const dict = NAV_I18N[lang] || NAV_I18N.en;
    document.querySelectorAll('header [data-nav-i18n]').forEach(function (el) {
      const text = dict[el.dataset.navI18n];
      if (text) el.textContent = text;
    });
    if (navLangLabel) navLangLabel.textContent = (NAV_I18N[lang] ? lang : 'en').toUpperCase();
    applyContentLanguage(lang);
  }

  let savedNavLang = 'en';
  try { savedNavLang = localStorage.getItem('barkea_lang') || 'en'; } catch (e) {}
  applyNavLanguage(savedNavLang);

  document.querySelectorAll('.nav-lang-option').forEach(function (opt) {
    opt.addEventListener('click', function (e) {
      e.preventDefault();
      const lang = opt.dataset.lang;
      applyNavLanguage(lang);
      try { localStorage.setItem('barkea_lang', lang); } catch (err) {}
    });
  });

  const contactForm = document.querySelector('.contact-form-wrapper form');

  if (contactForm) {
    const fields = {
      first_name: { label: 'First name' },
      last_name: { label: 'Last name' },
      email: { label: 'Email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { label: 'Phone', pattern: /^[+\d][\d\s().-]{6,}$/ },
      country: { label: 'Country' },
      message: { label: 'Message' }
    };

    const BOTH_CHECKBOXES_MSG = 'Please tick the required consent checkbox before submitting the form.';

    function showFieldError(input, message) {
      clearFieldError(input);
      input.classList.add('field-invalid');
      const error = document.createElement('span');
      error.className = 'field-error-msg';
      error.textContent = message;
      input.insertAdjacentElement('afterend', error);
    }

    function clearFieldError(input) {
      input.classList.remove('field-invalid');
      const group = input.closest('.form-group') || input.parentElement;
      const existing = group.querySelector('.field-error-msg');
      if (existing) existing.remove();
    }

    function showFormStatus(message, type) {
      let statusEl = contactForm.querySelector('.form-status-msg');
      if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.className = 'form-status-msg';
        statusEl.setAttribute('role', 'alert');
        const cbBlock = contactForm.querySelector('.form-checkboxes');
        if (cbBlock) { cbBlock.insertAdjacentElement('afterend', statusEl); } else { contactForm.appendChild(statusEl); }
      }
      statusEl.textContent = message;
      statusEl.classList.remove('success', 'error');
      statusEl.classList.add(type);
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let firstInvalid = null;
      let allValid = true;

      Object.keys(fields).forEach(function (name) {
        const input = contactForm.querySelector('[name="' + name + '"]');
        if (!input) return;
        const value = input.value.trim();
        const rule = fields[name];

        if (!value) {
          showFieldError(input, rule.label + ' is required.');
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        } else if (rule.pattern && !rule.pattern.test(value)) {
          showFieldError(input, 'Please enter a valid ' + rule.label.toLowerCase() + '.');
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        } else {
          clearFieldError(input);
        }
      });

      const checkboxes = Array.from(contactForm.querySelectorAll('.checkbox-container input[type="checkbox"][required]'));
      const uncheckedBoxes = checkboxes.filter(function (cb) { return !cb.checked; });
      checkboxes.forEach(function (cb) {
        cb.closest('.checkbox-container').classList.toggle('checkbox-invalid', !cb.checked);
      });
      if (uncheckedBoxes.length) {
        allValid = false;
        showFormStatus(BOTH_CHECKBOXES_MSG, 'error');
        if (!firstInvalid) firstInvalid = uncheckedBoxes[0];
      }

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const endpoint = contactForm.dataset.endpoint || (contactForm.action && contactForm.action !== '#' && !contactForm.action.endsWith('#') ? contactForm.action : null);

      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
      }

      function handleSuccess() {
        showFormStatus('Thank you — your message has been sent. We will be in touch shortly.', 'success');
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }

      function handleFailure() {
        showFormStatus('Something went wrong sending your message. Please try again or email us directly.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }

      if (endpoint) {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm)
        })
          .then(function (res) { res.ok ? handleSuccess() : handleFailure(); })
          .catch(handleFailure);
      } else {
        handleFailure();
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () { clearFieldError(input); });
    });

    const formCheckboxes = Array.from(contactForm.querySelectorAll('.checkbox-container input[type="checkbox"][required]'));
    formCheckboxes.forEach(function (cb) {
      cb.addEventListener('change', function () {
        cb.closest('.checkbox-container').classList.remove('checkbox-invalid');
        if (formCheckboxes.every(function (c) { return c.checked; })) {
          const statusEl = contactForm.querySelector('.form-status-msg.error');
          if (statusEl && statusEl.textContent === BOTH_CHECKBOXES_MSG) statusEl.remove();
        }
      });
    });
  }

});

 function openVilla(evt, villaName) {
let contents = document.getElementsByClassName("tab-content");
for (let i = 0; i < contents.length; i++) {
         contents[i].classList.remove("active-content");
            }

        let buttons = document.getElementsByClassName("tab-btn");
        for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
            }

        document.getElementById(villaName).classList.add("active-content");
         evt.currentTarget.classList.add("active");
        }