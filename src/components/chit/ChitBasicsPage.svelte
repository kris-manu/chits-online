<script>
  import { onMount } from "svelte";
  import { fade, slide, fly } from "svelte/transition";
  import { chitTerms, howItWorksSteps, faqItems } from "../../data/chitTerms";

  // State variables (Svelte 5 Runes)
  let theme = $state("light");
  let language = $state("ml");
  let searchTerm = $state("");
  let expandedFaqs = $state({});
  let checkedChecklist = $state({});

  // Canvas particle background
  let canvas;
  onMount(() => {
    let ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = 40;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          theme === "dark"
            ? "rgba(16, 185, 129, 0.25)"
            : "rgba(0, 133, 86, 0.15)";
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 130) * 0.08;
            ctx.strokeStyle =
              theme === "dark"
                ? `rgba(16, 185, 129, ${alpha})`
                : `rgba(0, 133, 86, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Load theme & language preferences
    const isDark = document.documentElement.classList.contains("dark");
    theme = isDark ? "dark" : "light";

    const storedLang = localStorage.getItem("app-lang");
    if (storedLang === "ml" || storedLang === "en") {
      language = storedLang;
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  });

  $effect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  // Filtered terms based on search query
  const filteredTerms = $derived.by(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return chitTerms;
    return chitTerms.filter(
      (t) =>
        t.termMl.toLowerCase().includes(query) ||
        t.termEn.toLowerCase().includes(query) ||
        t.descMl.toLowerCase().includes(query) ||
        t.descEn.toLowerCase().includes(query)
    );
  });

  function toggleFAQ(id) {
    expandedFaqs[id] = !expandedFaqs[id];
  }

  function toggleChecklist(index) {
    checkedChecklist[index] = !checkedChecklist[index];
  }

  // Toggle language preference
  function setLanguage(lang) {
    language = lang;
    localStorage.setItem("app-lang", lang);
  }

  // Scroll to section smoothly
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Checklist items configuration
  const checklistItems = [
    { ml: "ആകെ ചിട്ടി തുക (Chit Value)", en: "Total chit scheme value" },
    { ml: "പ്രതിമാസ അടവ് തുക (Monthly Installment)", en: "Monthly installment amount" },
    { ml: "ചിട്ടി കാലാവധി / മാസങ്ങൾ (Duration)", en: "Total duration / number of rounds" },
    { ml: "ഫോർമാൻ കമ്മീഷൻ ശതമാനം (Foreman Commission)", en: "Foreman commission charges" },
    { ml: "ലേല വ്യവസ്ഥകളും നിയമാവലികളും (Auction Rules)", en: "Auction bidding procedures & rules" },
    { ml: "പരമാവധി ലേല പരിധി (Maximum Bid Limit)", en: "Maximum allowed discount limit" },
    { ml: "ഡിവിഡന്റ് വീതംവെപ്പ് രീതി (Dividend Calculation)", en: "How dividends are calculated & shared" },
    { ml: "പണം ലഭിക്കാൻ ആവശ്യമായ സുരക്ഷാ ജാമ്യങ്ങൾ (Security Requirements)", en: "Guarantees/collateral needed for prize payout" },
    { ml: "അടവ് വൈകിയാൽ ഉണ്ടാകുന്ന പിഴകൾ (Late-payment Penalties)", en: "Late-payment interest and penalty charges" },
    { ml: "ചിട്ടി മുടങ്ങിയാൽ ഉണ്ടാകുന്ന നിയമപരമായ ബാധ്യതകൾ (Default Rules)", en: "Consequences of defaulting on payments" },
    { ml: "സമ്മാന തുക എത്ര ദിവസത്തിനുള്ളിൽ നൽകും (Prize-money Payment)", en: "Timeline for releasing the prize money" },
    { ml: "ആവശ്യമായ ഔദ്യോഗിക രേഖകൾ (Documentation)", en: "Required registration forms & paperwork" },
    { ml: "ഇടയ്ക്ക് വെച്ച് പുറത്തുകടക്കാനുള്ള വ്യവസ്ഥകൾ (Refund/Exit Rules)", en: "Conditions & deductions for early exit" },
    { ml: "രജിസ്ട്രേഷൻ വിവരങ്ങളും ലൈസൻസും (Regulatory Information)", en: "Official registration number under the Chit Funds Act" }
  ];
</script>

<canvas id="bg-canvas" bind:this={canvas}></canvas>

<div class="min-h-screen text-on-background font-body-md antialiased overflow-x-hidden relative">
  <!-- BACKGROUND DECOR GLOWS -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] animate-pulse-glow"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-secondary/15 dark:bg-secondary/5 blur-[100px] animate-pulse-glow animate-float-slow"></div>
  </div>

  <main class="min-h-screen flex flex-col relative z-10">
    <!-- Header -->
    <header class="flex justify-between items-center w-full px-4 lg:px-12 h-18 sticky top-0 z-40 bg-background/45 backdrop-blur-3xl border-b border-outline-variant/30">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl shiny-btn flex items-center justify-center text-on-primary shadow-md">
          <span class="material-symbols-outlined font-bold text-lg">menu_book</span>
        </div>
        <span class="font-headline-md text-base md:text-xl font-bold tracking-tight text-primary">
          {language === 'ml' ? 'ചിട്ടി വിവരങ്ങൾ' : 'Chit Basics'}
        </span>
        <a 
          href="/calculator" 
          class="ml-2 md:ml-4 px-2.5 py-1.5 rounded-xl bg-outline-variant/25 hover:bg-outline-variant/40 text-on-surface-variant hover:text-primary border border-outline-variant/30 text-[10px] md:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <span class="material-symbols-outlined text-xs md:text-sm font-bold">calculate</span>
          <span>{language === 'ml' ? 'കാൽക്കുലേറ്റർ' : 'Calculator'}</span>
        </a>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <!-- Language Selector -->
        <div class="flex p-0.5 bg-outline-variant/15 dark:bg-white/5 rounded-xl border border-outline-variant/30 dark:border-white/10 relative overflow-hidden w-28 md:w-32 shadow-inner shrink-0">
          <div 
            class="absolute top-0.5 bottom-0.5 left-0.5 rounded-lg bg-primary transition-all duration-300 ease-out z-0 shadow"
            style="width: calc(50% - 2px); transform: translateX({language === 'ml' ? '0%' : '100%'});"
          ></div>
          <button 
            type="button" 
            class="flex-1 py-1 text-center text-[9px] md:text-[10px] font-bold rounded-lg transition-all duration-300 z-10 cursor-pointer {language === 'ml' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
            onclick={() => setLanguage('ml')}
          >
            മലയാളം
          </button>
          <button 
            type="button" 
            class="flex-1 py-1 text-center text-[9px] md:text-[10px] font-bold rounded-lg transition-all duration-300 z-10 cursor-pointer {language === 'en' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
            onclick={() => setLanguage('en')}
          >
            English
          </button>
        </div>

        <!-- Theme Switcher -->
        <button
          class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-outline-variant/25 dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer active:scale-95 shadow-sm"
          onclick={() => theme = theme === 'dark' ? 'light' : 'dark'}
          aria-label="Toggle Theme"
        >
          {#if theme === 'dark'}
            <span class="material-symbols-outlined text-sm md:text-lg animate-float">light_mode</span>
          {:else}
            <span class="material-symbols-outlined text-sm md:text-lg animate-float">dark_mode</span>
          {/if}
        </button>
      </div>
    </header>

    <!-- Page Content Container -->
    <div class="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-16">
      
      <!-- HERO SECTION -->
      <section class="glass-card rounded-3xl p-8 lg:p-14 text-center relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        <div class="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 dark:bg-primary/5 blur-[90px] rounded-full"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/15 dark:bg-secondary/5 blur-[90px] rounded-full"></div>
        
        <span class="text-on-surface-variant font-label-sm uppercase tracking-[0.25em] mb-4 text-xs font-bold bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full text-primary border border-primary/20">
          {language === 'ml' ? 'ധനകാര്യ ഗൈഡ്' : 'Financial Literacy'}
        </span>
        
        <h1 class="font-headline-lg text-3xl lg:text-5xl font-bold tracking-tight text-primary leading-tight max-w-3xl">
          {language === 'ml' ? 'ചിട്ടി എന്നാൽ എന്താണ്?' : 'What is a Chit Fund?'}
        </h1>
        
        <p class="text-on-surface-variant text-sm lg:text-base leading-relaxed max-w-2xl mt-6 font-medium">
          {language === 'ml' 
            ? 'ഒരു കൂട്ടം അംഗങ്ങൾ ചേർന്ന് ഓരോ മാസവും തുല്യമായ തുക വീതം അടയ്ക്കുകയും, ലേലം വഴിയോ നറുക്കെടുപ്പ് വഴിയോ ലഭിക്കുന്ന തുക ആവശ്യമുള്ള അംഗങ്ങൾക്ക് നൽകുകയും ചെയ്യുന്ന ഒരു പരമ്പരാഗത സാമ്പത്തിക പദ്ധതിയാണ് ചിട്ടി. ഇത് ഒരേസമയം സമ്പാദ്യവും വായ്പയും ആയി ഉപയോഗിക്കാം.'
            : 'A chit fund is a traditional financial instrument that combines savings and borrowing. A group of subscribers contribute a fixed amount periodically, and the accumulated monthly pool is awarded to a member through an auction or draw mechanism.'}
        </p>

        <div class="pt-8 flex flex-wrap gap-4 justify-center">
          <button 
            class="px-6 py-3.5 rounded-xl shiny-btn text-on-primary font-bold text-sm shadow-lg active:scale-98 cursor-pointer"
            onclick={() => scrollTo('how-it-works')}
          >
            {language === 'ml' ? 'ചിട്ടി പ്രവർത്തിക്കുന്നത് എങ്ങനെ?' : 'See How It Works'}
          </button>
          <button 
            class="px-6 py-3.5 rounded-xl border border-outline hover:bg-outline-variant/15 text-on-surface font-bold text-sm transition-all active:scale-98 cursor-pointer"
            onclick={() => scrollTo('glossary')}
          >
            {language === 'ml' ? 'പ്രധാന ചിട്ടി പദങ്ങൾ' : 'Explore Chit Terms'}
          </button>
        </div>
      </section>

      <!-- HOW A CHIT WORKS TIMELINE -->
      <section id="how-it-works" class="space-y-6">
        <div class="text-center space-y-2">
          <h2 class="font-headline-md text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            {language === 'ml' ? 'ചിട്ടി പ്രവർത്തിക്കുന്ന ഘട്ടങ്ങൾ' : 'How a Chit Fund Works'}
          </h2>
          <p class="text-on-surface-variant text-xs md:text-sm font-semibold">
            {language === 'ml' ? 'ഒരു മാസ ചിട്ടിയുടെ ഓരോ ഘട്ടങ്ങളും എങ്ങനെയെന്ന് താഴെ കാണാം' : 'A simple visualization of the monthly chit transaction cycle.'}
          </p>
        </div>

        <!-- Desktop Horizontal Timeline / Mobile Vertical Cards -->
        <div class="grid grid-cols-1 md:grid-cols-7 gap-4 pt-6">
          {#each howItWorksSteps as step, i}
            <div class="glass-card p-5 rounded-2xl relative shadow flex flex-col items-center text-center transition-all hover:translate-y-[-2px] border border-outline-variant/30">
              <span class="absolute top-3 left-3 font-data-mono text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                0{step.step}
              </span>
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 text-primary shrink-0 mb-4 mt-2">
                <span class="material-symbols-outlined text-xl">{step.icon}</span>
              </div>
              <h3 class="font-headline-md text-xs lg:text-sm font-bold text-on-surface mb-2">
                {language === 'ml' ? step.titleMl : step.titleEn}
              </h3>
              <p class="text-[10.5px] leading-relaxed text-on-surface-variant font-medium">
                {language === 'ml' ? step.descMl : step.descEn}
              </p>
              
              <!-- Directional Arrow for desktop -->
              {#if i < howItWorksSteps.length - 1}
                <div class="hidden md:block absolute top-1/2 right-[-14px] transform -translate-y-1/2 text-primary/40 z-20">
                  <span class="material-symbols-outlined text-lg">arrow_forward</span>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>

      <!-- GLOSSARY SECTION -->
      <section id="glossary" class="space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-outline-variant/30 pb-4">
          <div class="text-center md:text-left space-y-1.5">
            <h2 class="font-headline-md text-2xl lg:text-3xl font-bold text-primary tracking-tight">
              {language === 'ml' ? 'പ്രധാന ചിട്ടി പദാവലികൾ' : 'Basic Chit Terms'}
            </h2>
            <p class="text-on-surface-variant text-xs md:text-sm font-semibold">
              {language === 'ml' ? 'ചിട്ടി വ്യവസ്ഥകളിൽ സാധാരണയായി കാണുന്ന പദങ്ങളുടെ അർത്ഥങ്ങൾ' : 'Bilingual dictionary of 20 essential terms used in chit funds.'}
            </p>
          </div>

          <!-- Search bar -->
          <div class="flex items-center bg-outline-variant/15 dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 rounded-xl px-4 py-2 gap-2 w-full md:w-72 shadow-inner">
            <span class="material-symbols-outlined text-outline text-base">search</span>
            <input
              class="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-on-surface placeholder:text-outline-variant w-full p-0"
              placeholder={language === 'ml' ? 'വാക്കോ അർത്ഥമോ തിരയുക...' : 'Search term or description...'}
              type="text"
              bind:value={searchTerm}
            />
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filteredTerms as term (term.id)}
            <div id={term.id} class="glass-card p-6 rounded-2xl shadow hover:border-primary/50 transition-all duration-300 flex flex-col justify-between border border-outline-variant/30 scroll-mt-20">
              <div class="space-y-3">
                <div class="flex justify-between items-start">
                  <h3 class="font-headline-md text-base md:text-lg font-bold text-primary">
                    {term.termMl}
                  </h3>
                  <span class="font-data-mono text-[10px] font-bold text-outline-variant uppercase tracking-wider bg-outline-variant/10 px-2 py-0.5 rounded-lg">
                    {term.termEn}
                  </span>
                </div>
                
                <div class="space-y-2 border-t border-outline-variant/10 dark:border-white/5 pt-2">
                  <p class="text-xs text-on-surface leading-relaxed font-semibold">
                    <span class="text-[9px] uppercase tracking-wider text-outline font-bold block mb-0.5">മലയാളം</span>
                    {term.descMl}
                  </p>
                  <p class="text-xs text-on-surface-variant leading-relaxed font-medium">
                    <span class="text-[9px] uppercase tracking-wider text-outline font-bold block mb-0.5">English</span>
                    {term.descEn}
                  </p>
                </div>
              </div>

              {#if term.exampleMl || term.exampleEn}
                <div class="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 text-[10.5px] leading-relaxed">
                  <span class="material-symbols-outlined text-xs text-primary font-bold align-middle mr-1">lightbulb</span>
                  <span class="font-bold text-primary">{language === 'ml' ? 'ഉദാഹരണം:' : 'Example:'}</span>
                  <p class="text-on-surface-variant mt-1 font-semibold">{language === 'ml' ? term.exampleMl : term.exampleEn}</p>
                </div>
              {/if}
            </div>
          {:else}
            <div class="col-span-full text-center py-12 text-outline-variant font-bold">
              {language === 'ml' ? 'തിരഞ്ഞ പദങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല.' : 'No terms found matching your search.'}
            </div>
          {/each}
        </div>
      </section>

      <!-- DEEP CONCEPT EXPLANATIONS -->
      <section class="space-y-8">
        <div class="text-center space-y-2">
          <h2 class="font-headline-md text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            {language === 'ml' ? 'പ്രധാന ചിട്ടി ആശയങ്ങൾ വിശദമായി' : 'Deep Dives into Key Concepts'}
          </h2>
          <p class="text-on-surface-variant text-xs md:text-sm font-semibold">
            {language === 'ml' ? 'കൂടുതൽ പണമിടപാടുകളും വ്യവസ്ഥകളും മനസ്സിലാക്കാം' : 'Explanations of complex terms with structured numerical examples.'}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Chit Value -->
          <div class="glass-card p-6 lg:p-8 rounded-3xl border border-outline-variant/30 space-y-4">
            <h3 class="font-headline-md text-base md:text-lg font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">payments</span>
              {language === 'ml' ? 'ചിട്ടി തുക (Chit Value)' : 'Chit Value'}
            </h3>
            <p class="text-xs text-on-surface-variant leading-relaxed font-semibold">
              {language === 'ml'
                ? 'ചിട്ടിയുടെ മൊത്തം മൂല്യമാണിത്. അതായത് ഒരു അംഗം ഒടുവിൽ വരെ നൽകേണ്ട ആകെ സംഖ്യ. വരിസംഖ്യയെ ആകെ മാസങ്ങൾ കൊണ്ട് ഗുണിച്ച് ഇത് കണ്ടെത്താം.'
                : 'Chit value (or gross value) is the total money collected in a single month if everyone pays full face value. It is the maximum potential payout before any discounts.'}
            </p>
            <div class="p-4 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/30 font-data-mono text-xs text-center space-y-2">
              <div class="font-bold text-primary">{language === 'ml' ? 'ഉദാഹരണം (Hypothetical Example)' : 'Hypothetical Example'}</div>
              <div class="grid grid-cols-3 gap-2 text-on-surface pt-2">
                <div>
                  <span class="text-[9px] text-outline font-bold uppercase block">{language === 'ml' ? 'തവണ തുക' : 'Installment'}</span>
                  ₹25,000
                </div>
                <div class="text-primary font-bold">×</div>
                <div>
                  <span class="text-[9px] text-outline font-bold uppercase block">{language === 'ml' ? 'ആകെ മാസം' : 'Months'}</span>
                  100 {language === 'ml' ? 'മാസം' : 'Months'}
                </div>
              </div>
              <div class="pt-2 border-t border-outline-variant/20 text-sm font-bold text-primary text-glow-green">
                {language === 'ml' ? 'ആകെ ചിട്ടി തുക: ₹25,00,000' : 'Total Chit Value: ₹25,00,000'}
              </div>
            </div>
          </div>

          <!-- Prize Money -->
          <div class="glass-card p-6 lg:p-8 rounded-3xl border border-outline-variant/30 space-y-4">
            <h3 class="font-headline-md text-base md:text-lg font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">monetization_on</span>
              {language === 'ml' ? 'സമ്മാന തുക (Prize Money)' : 'Prize Money'}
            </h3>
            <p class="text-xs text-on-surface-variant leading-relaxed font-semibold">
              {language === 'ml'
                ? 'ലേലവിജയിയായ അംഗത്തിന് കയ്യിൽ ലഭിക്കുന്ന നെറ്റ് തുകയാണിത്. ചിട്ടി തുകയിൽ നിന്നും ലേലത്തിൽ വിട്ടുനൽകിയ ഡിസ്കൗണ്ടും ഫോർമാൻ കമ്മീഷനും കുറച്ചാണ് ഈ തുക നൽകുന്നത്.'
                : 'Prize money is the net cash paid to the auction winner. It is calculated by taking the gross chit value and subtracting the auction discount and foreman commission.'}
            </p>
            <div class="p-4 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/30 font-data-mono text-xs text-center space-y-2">
              <div class="font-bold text-primary">{language === 'ml' ? 'ഉദാഹരണം (Hypothetical Example)' : 'Hypothetical Example'}</div>
              <div class="text-on-surface text-left space-y-1 pt-1">
                <div class="flex justify-between"><span>{language === 'ml' ? 'ചിട്ടി തുക:' : 'Chit Value:'}</span> <strong>₹25,00,000</strong></div>
                <div class="flex justify-between text-error"><span>{language === 'ml' ? 'ലേല ഡിസ്കൗണ്ട്:' : 'Auction Discount:'}</span> <strong>- ₹5,00,000</strong></div>
                <div class="flex justify-between text-error"><span>{language === 'ml' ? 'ഫോർമാൻ കമ്മീഷൻ (5%):' : 'Foreman Commission (5%):'}</span> <strong>- ₹1,25,000</strong></div>
                <div class="flex justify-between border-t border-outline-variant/20 pt-2 font-bold text-primary text-glow-green text-sm">
                  <span>{language === 'ml' ? 'കയ്യിൽ ലഭിക്കുന്ന തുക:' : 'Net Prize Money:'}</span> <span>₹18,75,000</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Discount -->
          <div class="glass-card p-6 lg:p-8 rounded-3xl border border-outline-variant/30 space-y-4">
            <h3 class="font-headline-md text-base md:text-lg font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">gavel</span>
              {language === 'ml' ? 'ലേല ഡിസ്കൗണ്ട് (Auction Discount)' : 'Auction Discount'}
            </h3>
            <p class="text-xs text-on-surface-variant leading-relaxed font-semibold">
              {language === 'ml'
                ? 'അടിയന്തിരമായി തുക ആവശ്യപ്പെടുമ്പോൾ ഒരു വരിക്കാരൻ വിട്ടുനൽകാൻ സമ്മതിക്കുന്ന തുകയാണിത്. ഉദാഹരണത്തിന്, ₹25 ലക്ഷത്തിന് പകരം ₹20 ലക്ഷം എടുക്കാൻ സമ്മതിച്ചാൽ ഡിസ്കൗണ്ട് ₹5 ലക്ഷം ആണ്.'
                : 'Discount is the difference between the total chit value and the bid winning price. The subscriber agrees to receive less principal for immediate cash access.'}
            </p>
            <div class="p-4 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/30 font-data-mono text-xs text-center space-y-2">
              <div class="font-bold text-primary">{language === 'ml' ? 'ഉദാഹരണം (Hypothetical Example)' : 'Hypothetical Example'}</div>
              <div class="text-on-surface text-left space-y-1 pt-1">
                <div class="flex justify-between"><span>{language === 'ml' ? 'ചിട്ടി തുക:' : 'Chit Value:'}</span> <strong>₹25,00,000</strong></div>
                <div class="flex justify-between"><span>{language === 'ml' ? 'കൈപ്പറ്റാൻ ആവശ്യപ്പെട്ട തുക:' : 'Bid Winner Accept Price:'}</span> <strong>₹20,00,000</strong></div>
                <div class="flex justify-between border-t border-outline-variant/20 pt-2 font-bold text-primary text-sm">
                  <span>{language === 'ml' ? 'ആകെ ലേല ഡിസ്കൗണ്ട്:' : 'Auction Discount:'}</span> <span>₹5,00,000</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dividend vs Interest -->
          <div class="glass-card p-6 lg:p-8 rounded-3xl border border-outline-variant/30 space-y-4">
            <h3 class="font-headline-md text-base md:text-lg font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">account_balance_wallet</span>
              {language === 'ml' ? 'ഡിവിഡന്റ് vs പലിശ (Dividend vs Interest)' : 'Dividend vs Interest'}
            </h3>
            <p class="text-xs text-on-surface-variant leading-relaxed font-semibold">
              {language === 'ml'
                ? 'ലേല ഡിസ്കൗണ്ട് എല്ലാ അംഗങ്ങൾക്കും തുല്യമായി ലഭിക്കുന്നതിനെയാണ് ഡിവിഡന്റ് എന്ന് പറയുന്നത്. ഇത് വായ്പാ പലിശ അല്ല, ഉറപ്പുള്ള വരുമാനവുമല്ല. ഒരു മാസത്തെ ലേലത്തിന്റെ അടിസ്ഥാനത്തിൽ മാത്രമാണ് ഇത് കുറയുന്നത്.'
                : 'Dividends are distributed from the auction discounts, reducing monthly installments. Unlike fixed bank deposits, dividends are NOT guaranteed interest. They vary every month based on active bidding.'}
            </p>
            <div class="p-4 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/30 font-data-mono text-xs text-center space-y-2">
              <div class="font-bold text-primary">{language === 'ml' ? 'ഉദാഹരണം (Hypothetical Example)' : 'Hypothetical Example'}</div>
              <div class="text-on-surface text-left space-y-1 pt-1">
                <div class="flex justify-between"><span>{language === 'ml' ? 'ലേല ഡിസ്കൗണ്ട്:' : 'Discount Pool:'}</span> <strong>₹5,00,000</strong></div>
                <div class="flex justify-between text-error"><span>{language === 'ml' ? 'ഫോർമാൻ കമ്മീഷൻ (5%):' : 'Foreman Fee (5%):'}</span> <strong>- ₹1,25,000</strong></div>
                <div class="flex justify-between"><span>{language === 'ml' ? 'അംഗങ്ങളുടെ എണ്ണം:' : 'Total Subscribers:'}</span> <strong>100</strong></div>
                <div class="flex justify-between border-t border-outline-variant/20 pt-2 font-bold text-primary text-glow-green text-sm">
                  <span>{language === 'ml' ? 'ഡിവിഡന്റ് (തവണയിൽ കുറവുണ്ടാകുന്നത്):' : 'Dividend per Subscriber:'}</span> <span>₹3,750</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <!-- INFOGRAPHIC: EARLY vs LATE BIDDER STRATEGY -->
      <section class="space-y-6">
        <div class="text-center space-y-2">
          <h2 class="font-headline-md text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            {language === 'ml' ? 'എപ്പോൾ ലേലം ചെയ്യണം?' : 'When Should You Bid?'}
          </h2>
          <p class="text-on-surface-variant text-xs md:text-sm font-semibold">
            {language === 'ml' ? 'ആദ്യ മാസം ലേലം ചെയ്യുന്നതും അവസാനം വരെ ക്ഷമ കാണിക്കുന്നതും – ഒരു താരതമ്യം' : 'Comparing early bidder vs patient subscriber — the core substitution trade-off'}
          </p>
        </div>

        <div class="glass-card rounded-3xl p-6 lg:p-10 border border-outline-variant/30 space-y-7">

          <!-- Legend -->
          <div class="flex flex-wrap items-center gap-5 justify-center text-[10px] font-bold text-on-surface-variant">
            <div class="flex items-center gap-1.5">
              <div class="w-3.5 h-3 rounded-sm bg-error/65 shrink-0"></div>
              <span>{language === 'ml' ? 'ഡിസ്കൗണ്ട് ചെലവ്' : 'Discount Cost'}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3.5 h-3 rounded-sm bg-secondary/65 shrink-0"></div>
              <span>{language === 'ml' ? 'ഡിവിഡന്റ് ലാഭം' : 'Total Dividends Earned'}</span>
            </div>
          </div>

          <!-- Row: Early Bidder Month 1 -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <div class="flex items-center gap-2 shrink-0 min-w-[160px]">
                <div class="w-9 h-9 rounded-xl bg-error/15 flex items-center justify-center text-error shrink-0">
                  <span class="material-symbols-outlined text-sm">bolt</span>
                </div>
                <div>
                  <div class="text-[11px] font-bold text-on-surface">{language === 'ml' ? 'ആദ്യ മാസ ലേലം' : 'Month 1 Bidder'}</div>
                  <div class="text-[9px] text-on-surface-variant font-medium">{language === 'ml' ? 'ഉടൻ ₹18.75L ലഭിക്കുന്നു' : 'Gets cash fast ₹18.75L'}</div>
                </div>
              </div>
              <div class="flex-1 min-w-[120px] space-y-1.5">
                <div class="relative h-4 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div class="absolute left-0 top-0 h-full bg-error/60 rounded-full" style="width: 80%"></div>
                </div>
                <div class="relative h-4 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div class="absolute left-0 top-0 h-full bg-secondary/60 rounded-full" style="width: 2%"></div>
                </div>
              </div>
              <div class="text-right shrink-0 w-28 font-data-mono text-[10px] font-bold">
                <div class="text-error">−₹5,00,000</div>
                <div class="text-secondary">+₹0</div>
              </div>
            </div>
          </div>

          <!-- Row: Month 50 Bidder -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <div class="flex items-center gap-2 shrink-0 min-w-[160px]">
                <div class="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                  <span class="material-symbols-outlined text-sm">balance</span>
                </div>
                <div>
                  <div class="text-[11px] font-bold text-on-surface">{language === 'ml' ? 'മദ്ധ്യ മാസ ലേലം (50)' : 'Month 50 Bidder'}</div>
                  <div class="text-[9px] text-on-surface-variant font-medium">{language === 'ml' ? 'ചെലവും ലാഭവും ഏകദേശം സമം' : 'Break-even point'}</div>
                </div>
              </div>
              <div class="flex-1 min-w-[120px] space-y-1.5">
                <div class="relative h-4 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div class="absolute left-0 top-0 h-full bg-error/60 rounded-full" style="width: 44%"></div>
                </div>
                <div class="relative h-4 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div class="absolute left-0 top-0 h-full bg-secondary/60 rounded-full" style="width: 36%"></div>
                </div>
              </div>
              <div class="text-right shrink-0 w-28 font-data-mono text-[10px] font-bold">
                <div class="text-error">~−₹3,00,000</div>
                <div class="text-secondary">~+₹1,87,500</div>
              </div>
            </div>
          </div>

          <!-- Row: Month 100 Patient Subscriber -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <div class="flex items-center gap-2 shrink-0 min-w-[160px]">
                <div class="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                  <span class="material-symbols-outlined text-sm">savings</span>
                </div>
                <div>
                  <div class="text-[11px] font-bold text-on-surface">{language === 'ml' ? 'അവസാന മാസ വരിക്കാർ' : 'Month 100 Subscriber'}</div>
                  <div class="text-[9px] text-on-surface-variant font-medium">{language === 'ml' ? 'ഡിസ്കൗണ്ട് ഇല്ല, ഡിവിഡന്റ് പരമ്പര' : 'No bid cost, all dividends'}</div>
                </div>
              </div>
              <div class="flex-1 min-w-[120px] space-y-1.5">
                <div class="relative h-4 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div class="absolute left-0 top-0 h-full bg-error/60 rounded-full" style="width: 0%"></div>
                </div>
                <div class="relative h-4 bg-outline-variant/20 rounded-full overflow-hidden">
                  <div class="absolute left-0 top-0 h-full bg-secondary/60 rounded-full" style="width: 80%"></div>
                </div>
              </div>
              <div class="text-right shrink-0 w-28 font-data-mono text-[10px] font-bold">
                <div class="text-error">₹0</div>
                <div class="text-secondary">~+₹3,75,000</div>
              </div>
            </div>
          </div>

          <!-- Insight callout -->
          <div class="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-xs leading-relaxed">
            <span class="material-symbols-outlined text-primary align-middle text-sm mr-1">tips_and_updates</span>
            <span class="font-bold text-primary">{language === 'ml' ? 'ഉൾക്കാഴ്ച:' : 'Key Insight:'}</span>
            <span class="text-on-surface-variant ml-1 font-medium">
              {language === 'ml'
                ? 'ആദ്യ മാസം ലേലം ചെയ്യുന്നത് അടിയന്തിര ആവശ്യങ്ങൾക്ക് നല്ലതാണ്, പക്ഷേ ഡിസ്കൗണ്ട് ചെലവ് ഉണ്ടാകും. ക്ഷമ കാണിച്ച് ഡിവിഡന്റ് ശേഖരിക്കുന്നതാണ് "Substitution" തന്ത്രം.'
                : 'Early bidding gives immediate liquidity but at a premium discount cost. Staying patient to collect monthly dividends then receiving the full chit value at the end is the optimal substitution strategy.'}
            </span>
          </div>

          <p class="text-center text-[9px] text-on-surface-variant opacity-60">{language === 'ml' ? '* ₹25,00,000 ചിട്ടി അടിസ്ഥാനമാക്കിയ ഏകദേശ കണക്കുകൾ' : '* Approximate figures based on a ₹25,00,000 hypothetical chit'}</p>
        </div>
      </section>

      <!-- INTERACTIVE EXAMPLE PANEL -->
      <section class="glass-card rounded-3xl p-6 lg:p-10 border border-outline-variant/30 relative">
        <h2 class="font-headline-md text-xl lg:text-2xl font-bold text-primary flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined">lightbulb_circle</span>
          {language === 'ml' ? 'ഒരു ഉദാഹരണത്തിലൂടെ ലളിതമായി മനസ്സിലാക്കാം' : "Let's Understand with a Hypothetical Example"}
        </h2>
        <p class="text-xs text-on-surface-variant leading-relaxed max-w-3xl mb-8 font-semibold">
          {language === 'ml'
            ? '100 അംഗങ്ങളുള്ള, 100 മാസം നീണ്ടുനിൽക്കുന്ന, പ്രതിമാസം ₹25,000 തവണയുള്ള ഒരു ചിട്ടിയുടെ പത്താമത്തെ മാസം ഒരു ലേലം നടക്കുന്നു എന്ന് കരുതുക. ചിട്ടി നിയമങ്ങൾ മനസ്സിലാക്കാൻ ഈ ലേല രംഗം നോക്കാം:'
            : 'Consider a hypothetical chit with 100 members, a 100-month duration, and a baseline contribution of ₹25,000. In Month 10, an auction is held. Let’s see what happens step-by-step:'}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div class="p-5 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/20">
            <span class="text-[9px] uppercase tracking-wider text-outline font-bold">{language === 'ml' ? 'ആകെ ചിട്ടി തുക' : 'Total Chit Value'}</span>
            <div class="font-headline-lg text-lg md:text-xl font-bold text-primary mt-1">₹25,00,000</div>
          </div>
          <div class="p-5 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/20">
            <span class="text-[9px] uppercase tracking-wider text-outline font-bold">{language === 'ml' ? 'ലേല ഡിസ്കൗണ്ട്' : 'Auction Discount'}</span>
            <div class="font-headline-lg text-lg md:text-xl font-bold text-error mt-1">₹5,00,000</div>
          </div>
          <div class="p-5 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/20">
            <span class="text-[9px] uppercase tracking-wider text-outline font-bold">{language === 'ml' ? 'കയ്യിൽ ലഭിച്ച സമ്മാന തുക' : 'Winner Net Payout'}</span>
            <div class="font-headline-lg text-lg md:text-xl font-bold text-secondary text-glow-green mt-1">₹18,75,000</div>
          </div>
        </div>

        <div class="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
          <h4 class="text-xs font-bold text-primary">{language === 'ml' ? 'അംഗങ്ങളുടെ പ്രതിമാസ നേട്ടങ്ങൾ എങ്ങനെയെന്ന് നോക്കാം:' : 'What happens to the remaining funds?'}</h4>
          <ol class="list-decimal pl-5 text-xs text-on-surface-variant leading-relaxed space-y-2.5 font-medium">
            <li>
              {language === 'ml'
                ? 'ലേല ഡിസ്കൗണ്ട് ആയ ₹5,00,000 മുഴുവനായി ലേലവിജയിക്ക് നഷ്ടമാകും.'
                : 'The winning bidder receives ₹18,75,000 and foregoes the ₹5,00,000 discount.'}
            </li>
            <li>
              {language === 'ml'
                ? 'അതിൽ നിന്നും 5% ഫോർമാൻ കമ്മീഷനായി ₹1,25,000 രൂപ ചിട്ടി നടത്തിപ്പുകാർ ഈടാക്കും.'
                : 'From the ₹5,00,000 discount, the foreman commission of ₹1,25,000 (5% of total chit value) is deducted.'}
            </li>
            <li>
              {language === 'ml'
                ? 'ബാക്കി വരുന്ന ₹3,75,000 രൂപ മറ്റ് 100 അംഗങ്ങൾക്കുമായി വീതിക്കപ്പെടും (₹3,750 ഓരോ അംഗത്തിനും ഡിവിഡന്റായി ലഭിക്കും).'
                : 'The remaining ₹3,75,000 is distributed equally among all 100 subscribers, resulting in a ₹3,750 dividend for each member.'}
            </li>
            <li>
              {language === 'ml'
                ? 'അതിനാൽ അടുത്ത മാസം അംഗങ്ങൾ ₹25,000 അടയ്ക്കേണ്ടതില്ല, പകരം ₹25,000 - ₹3,750 = ₹21,250 അടച്ചാൽ മതിയാകും.'
                : 'Consequently, in the next month, members pay ₹21,250 (₹25,000 installment minus ₹3,750 dividend) instead of the full ₹25,000.'}
            </li>
          </ol>
        </div>
      </section>

      <!-- INFOGRAPHIC: MONEY FLOW DIAGRAM -->
      <section class="space-y-6">
        <div class="text-center space-y-2">
          <h2 class="font-headline-md text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            {language === 'ml' ? 'ഒരു ലേലത്തിലെ പണ ഒഴുക്ക്' : 'Money Flow in One Auction Month'}
          </h2>
          <p class="text-on-surface-variant text-xs md:text-sm font-semibold">
            {language === 'ml' ? '₹25 ലക്ഷം മൂന്ന് ദിശകളിലേക്ക് ഒഴുകുന്ന വഴി' : 'How ₹25,00,000 splits three ways through a single auction'}
          </p>
        </div>

        <div class="glass-card rounded-3xl p-6 lg:p-10 border border-outline-variant/30 space-y-8">

          <!-- Source: Subscribers pool -->
          <div class="flex flex-col items-center gap-3">
            <h3 class="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{language === 'ml' ? 'ഉറവിടം' : 'Source'}</h3>
            <div class="flex flex-wrap justify-center gap-1.5">
              {#each Array.from({length: 10}) as _}
                <div class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary">
                  <span class="material-symbols-outlined text-[11px]">person</span>₹25,000
                </div>
              {/each}
              <div class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-outline-variant/20 border border-outline-variant/30 text-[9px] font-bold text-on-surface-variant">
                +90 {language === 'ml' ? 'പേർ' : 'more'}
              </div>
            </div>
            <p class="text-[10px] text-on-surface-variant font-semibold">
              100 {language === 'ml' ? 'അംഗങ്ങൾ' : 'members'} × ₹25,000 = <span class="text-primary font-bold">₹25,00,000</span>
            </p>
            <div class="flex flex-col items-center">
              <div class="w-px h-8 bg-gradient-to-b from-primary/60 to-primary/20"></div>
              <span class="material-symbols-outlined text-primary/60 text-xl -mt-1">arrow_downward</span>
            </div>
          </div>

          <!-- Auction event node -->
          <div class="flex flex-col items-center gap-3">
            <div class="w-full max-w-sm mx-auto px-6 py-4 rounded-2xl border border-outline-variant/30 bg-outline-variant/10 text-center">
              <div class="flex items-center justify-center gap-2 mb-1">
                <span class="material-symbols-outlined text-on-surface text-xl">gavel</span>
                <span class="font-bold text-on-surface text-sm">{language === 'ml' ? 'ലേലം' : 'Auction'}</span>
              </div>
              <p class="text-[10px] text-on-surface-variant font-semibold">
                {language === 'ml'
                  ? 'ഒരു അംഗം ₹20,00,000-ന് ലേലം ജയിക്കുന്നു → ₹5,00,000 ഡിസ്കൗണ്ട്'
                  : 'One member wins bid at ₹20,00,000 → ₹5,00,000 discount created'}
              </p>
            </div>
            <!-- Three split arrows -->
            <div class="flex justify-around w-full max-w-xl">
              <div class="flex flex-col items-center">
                <div class="w-px h-7 bg-secondary/50"></div>
                <span class="material-symbols-outlined text-secondary/70 text-base -mt-1">arrow_downward</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-px h-7 bg-error/50"></div>
                <span class="material-symbols-outlined text-error/70 text-base -mt-1">arrow_downward</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-px h-7 bg-primary/50"></div>
                <span class="material-symbols-outlined text-primary/70 text-base -mt-1">arrow_downward</span>
              </div>
            </div>
          </div>

          <!-- Three destination cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

            <!-- Winner -->
            <div class="p-5 rounded-2xl bg-secondary/10 border border-secondary/25 text-center space-y-2">
              <div class="w-11 h-11 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary mx-auto">
                <span class="material-symbols-outlined text-xl">emoji_events</span>
              </div>
              <div class="text-xs font-bold text-secondary">{language === 'ml' ? 'ലേലവിജയി' : 'Auction Winner'}</div>
              <div class="font-data-mono font-bold text-secondary text-2xl">₹18,75,000</div>
              <div class="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                {language === 'ml' ? 'ചിട്ടി − ഡിസ്കൗണ്ട് − കമ്മീഷൻ' : 'Pool − Discount − Commission'}
              </div>
              <div class="font-data-mono text-[9px] text-outline">₹25L − ₹5L − ₹1.25L</div>
            </div>

            <!-- Foreman -->
            <div class="p-5 rounded-2xl bg-error/5 border border-error/20 text-center space-y-2">
              <div class="w-11 h-11 rounded-2xl bg-error/10 flex items-center justify-center text-error mx-auto">
                <span class="material-symbols-outlined text-xl">manage_accounts</span>
              </div>
              <div class="text-xs font-bold text-error">{language === 'ml' ? 'ഫോർമാൻ കമ്മീഷൻ' : 'Foreman Commission'}</div>
              <div class="font-data-mono font-bold text-error text-2xl">₹1,25,000</div>
              <div class="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                5% {language === 'ml' ? 'ചിട്ടി തുകയിൽ' : 'of Chit Value'}
              </div>
              <div class="font-data-mono text-[9px] text-outline">₹25,00,000 × 5%</div>
            </div>

            <!-- Dividends -->
            <div class="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center space-y-2">
              <div class="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center text-primary mx-auto">
                <span class="material-symbols-outlined text-xl">diversity_3</span>
              </div>
              <div class="text-xs font-bold text-primary">{language === 'ml' ? 'ഓരോ അംഗത്തിനും ഡിവിഡന്റ്' : 'Dividend Per Member'}</div>
              <div class="font-data-mono font-bold text-primary text-2xl">₹3,750</div>
              <div class="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                {language === 'ml' ? 'നെറ്റ് ഡിസ്കൗണ്ട് ÷ 100 അംഗങ്ങൾ' : 'Net Discount ÷ 100 members'}
              </div>
              <div class="font-data-mono text-[9px] text-outline">(₹5L − ₹1.25L) ÷ 100</div>
            </div>

          </div>
        </div>
      </section>

      <!-- BEFORE JOINING CHECKLIST -->
      <section id="safety-checklist" class="space-y-6">
        <div class="text-center space-y-2">
          <h2 class="font-headline-md text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            {language === 'ml' ? 'ചിട്ടിയിൽ ചേരുവാൻ ഒരുങ്ങുകയാണോ? സുരക്ഷാ ചെക്ക്ലിസ്റ്റ്' : 'Before Joining a Chit: Safety Checklist'}
          </h2>
          <p class="text-on-surface-variant text-xs md:text-sm font-semibold">
            {language === 'ml' ? 'ചിട്ടിയിൽ ഒപ്പുവെക്കുന്നതിന് മുൻപ് ഇവ ഉറപ്പുവരുത്തുക' : 'Important checkpoints to verify with the foreman before committing.'}
          </p>
        </div>

        <div class="glass-card rounded-3xl p-6 lg:p-10 border border-outline-variant/30 max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each checklistItems as item, idx}
              <div 
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-outline-variant/15 duration-200 cursor-pointer select-none border border-transparent {checkedChecklist[idx] ? 'bg-primary/5 border-primary/20' : ''}"
                onclick={() => toggleChecklist(idx)}
              >
                <div class="w-6 h-6 rounded-lg flex items-center justify-center border {checkedChecklist[idx] ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant/70 text-transparent'} shrink-0 duration-200">
                  <span class="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div>
                  <p class="text-xs text-on-surface font-semibold {checkedChecklist[idx] ? 'line-through text-on-surface-variant/60' : ''}">
                    {language === 'ml' ? item.ml : item.en}
                  </p>
                </div>
              </div>
            {/each}
          </div>
          <div class="mt-8 text-center text-xs text-on-surface-variant font-medium opacity-85 border-t border-outline-variant/20 pt-4">
            {language === 'ml' 
              ? 'മുകളിലുള്ള എല്ലാ വിവരങ്ങളും ചിട്ടി കരാർ രേഖകളിൽ (Chit Agreement) കൃത്യമായി ഉണ്ടെന്ന് ഉറപ്പുവരുത്തുക.'
              : 'Make sure all these elements are explicitly outlined in the official Chit Agreement paperwork.'}
          </div>
        </div>
      </section>

      <!-- BENEFITS AND RISKS -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Benefits -->
        <div class="glass-card p-6 lg:p-8 rounded-3xl border border-outline-variant/30 space-y-5 bg-primary/[0.02]">
          <h3 class="font-headline-md text-base md:text-lg font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">thumb_up</span>
            {language === 'ml' ? 'പ്രതീക്ഷിക്കാവുന്ന ഗുണങ്ങൾ' : 'Potential Benefits'}
          </h3>
          <ul class="space-y-3.5 text-xs text-on-surface-variant leading-relaxed font-medium">
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-xs text-primary font-bold mt-0.5">done</span>
              <span>{language === 'ml' ? 'ഒരുമിച്ച് വലിയൊരു തുക (Lump Sum) പെട്ടെന്ന് കയ്യിൽ ലഭിക്കുന്നു.' : 'Provides access to a lumpsum pool for immediate project expenditures.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-xs text-primary font-bold mt-0.5">done</span>
              <span>{language === 'ml' ? 'പ്രതിമാസം പണം അടയ്ക്കേണ്ടതിനാൽ നിർബന്ധിത സമ്പാദ്യശീലം ഉണ്ടാകുന്നു.' : 'Enforces structured financial savings discipline among subscribers.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-xs text-primary font-bold mt-0.5">done</span>
              <span>{language === 'ml' ? 'കുറഞ്ഞ ചെലവിൽ മറ്റ് വായ്പകളേക്കാൾ വേഗത്തിൽ ആവശ്യത്തിന് പണം കണ്ടെത്താം.' : 'Option to bid and claim the money early in case of cash emergencies.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-xs text-primary font-bold mt-0.5">done</span>
              <span>{language === 'ml' ? 'ഓരോ ലേലത്തിലും ലഭിക്കുന്ന ഡിവിഡന്റ് തുക മാസ തവണകളിലെ ബാധ്യത കുറയ്ക്കുന്നു.' : 'Dividends distributed reduce the total cost of capital over time.'}</span>
            </li>
          </ul>
        </div>

        <!-- Risks -->
        <div class="glass-card p-6 lg:p-8 rounded-3xl border border-outline-variant/30 space-y-5 bg-error/[0.01]">
          <h3 class="font-headline-md text-base md:text-lg font-bold text-error flex items-center gap-2">
            <span class="material-symbols-outlined text-error">warning</span>
            {language === 'ml' ? 'സാധ്യതയുള്ള റിസ്കുകൾ' : 'Risks & Limitations'}
          </h3>
          <ul class="space-y-3.5 text-xs text-on-surface-variant leading-relaxed font-medium">
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-xs text-error font-bold mt-0.5">close</span>
              <span>{language === 'ml' ? 'തവണകൾ കൃത്യസമയത്ത് അടയ്ക്കാനുള്ള വലിയ സാമ്പത്തിക ബാധ്യത.' : 'Rigid commitment to pay the remaining installments once prize is claimed.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-xs text-error font-bold mt-0.5">close</span>
              <span>{language === 'ml' ? 'അടവുകൾ മുടങ്ങിയാൽ ഈടാക്കുന്ന വലിയ പിഴപ്പലിശകളും നിയമ നടപടികളും.' : 'Heavy penalty rates and recovery initiatives in case of missed installments.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-xs text-error font-bold mt-0.5">close</span>
              <span>{language === 'ml' ? 'പണം ലഭിക്കാൻ ആവശ്യമായ സുരക്ഷിതമായ ജാമ്യങ്ങൾ ഉറപ്പാക്കാനുള്ള ബുദ്ധിമുട്ട്.' : 'Strict security requirements must be satisfied to release prize money.'}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-xs text-error font-bold mt-0.5">close</span>
              <span>{language === 'ml' ? 'ലേലത്തിലെ അമിതമായ മത്സരം കാരണം കയ്യിൽ കിട്ടുന്ന തുക വളരെ കുറഞ്ഞു പോകാം.' : 'Competitive bidding discounts can significantly reduce net payout.'}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- INFOGRAPHIC: CHIT vs FD vs LOAN COMPARISON -->
      <section class="space-y-6">
        <div class="text-center space-y-2">
          <h2 class="font-headline-md text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            {language === 'ml' ? 'ചിട്ടി vs ബാങ്ക് FD vs വ്യക്തിഗത വായ്പ' : 'Chit Fund vs Bank FD vs Personal Loan'}
          </h2>
          <p class="text-on-surface-variant text-xs md:text-sm font-semibold">
            {language === 'ml' ? 'ഈ മൂന്ന് ജനകീയ സാമ്പത്തിക ഉൽപ്പന്നങ്ങൾ തമ്മിലുള്ള ഒറ്റനോട്ട താരതമ്യം' : 'A quick at-a-glance comparison of three common financial instruments'}
          </p>
        </div>

        <div class="glass-card rounded-3xl overflow-hidden border border-outline-variant/30">

          <!-- Header -->
          <div class="grid grid-cols-4 bg-outline-variant/10 border-b border-outline-variant/20">
            <div class="p-4 text-[9px] uppercase tracking-widest text-on-surface-variant font-bold border-r border-outline-variant/20 flex items-center">
              {language === 'ml' ? 'ഘടകം' : 'Feature'}
            </div>
            <div class="p-4 text-center border-r border-outline-variant/20">
              <span class="material-symbols-outlined text-primary text-xl block mb-1">savings</span>
              <span class="text-[11px] font-bold text-primary">{language === 'ml' ? 'ചിട്ടി' : 'Chit Fund'}</span>
            </div>
            <div class="p-4 text-center border-r border-outline-variant/20">
              <span class="material-symbols-outlined text-secondary text-xl block mb-1">account_balance</span>
              <span class="text-[11px] font-bold text-secondary">{language === 'ml' ? 'ബാങ്ക് FD' : 'Bank FD'}</span>
            </div>
            <div class="p-4 text-center">
              <span class="material-symbols-outlined text-error text-xl block mb-1">credit_card</span>
              <span class="text-[11px] font-bold text-error">{language === 'ml' ? 'വ്യക്തിഗത വായ്പ' : 'Personal Loan'}</span>
            </div>
          </div>

          <!-- Row: Liquidity -->
          <div class="grid grid-cols-4 border-b border-outline-variant/10 hover:bg-outline-variant/5 transition-colors">
            <div class="p-4 text-xs font-semibold text-on-surface-variant border-r border-outline-variant/10 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-outline shrink-0">water_drop</span>
              {language === 'ml' ? 'ലഭ്യത' : 'Liquidity'}
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-primary text-lg">radio_button_checked</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ലേലം വഴി' : 'Via Auction'}</div>
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-error text-lg">cancel</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ലോക്ക്-ഇൻ' : 'Lock-in Period'}</div>
            </div>
            <div class="p-4 text-center">
              <span class="material-symbols-outlined text-secondary text-lg">check_circle</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ഉടൻ ലഭ്യം' : 'Immediate'}</div>
            </div>
          </div>

          <!-- Row: Returns -->
          <div class="grid grid-cols-4 border-b border-outline-variant/10 hover:bg-outline-variant/5 transition-colors">
            <div class="p-4 text-xs font-semibold text-on-surface-variant border-r border-outline-variant/10 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-outline shrink-0">trending_up</span>
              {language === 'ml' ? 'വരുമാനം' : 'Returns'}
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-primary text-lg">radio_button_checked</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ഡിവിഡന്റ്' : 'Variable Dividend'}</div>
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-secondary text-lg">check_circle</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ഉറപ്പ് പലിശ' : 'Guaranteed Interest'}</div>
            </div>
            <div class="p-4 text-center">
              <span class="material-symbols-outlined text-error text-lg">cancel</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ഇല്ല (ചെലവ് മാത്രം)' : 'None (cost only)'}</div>
            </div>
          </div>

          <!-- Row: Savings Discipline -->
          <div class="grid grid-cols-4 border-b border-outline-variant/10 hover:bg-outline-variant/5 transition-colors">
            <div class="p-4 text-xs font-semibold text-on-surface-variant border-r border-outline-variant/10 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-outline shrink-0">schedule</span>
              {language === 'ml' ? 'സമ്പാദ്യ ശീലം' : 'Savings Discipline'}
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-secondary text-lg">check_circle</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'നിർബന്ധ മാസ അടവ്' : 'Enforced Monthly'}</div>
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-primary text-lg">radio_button_checked</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ഒരേ ഒരു തവണ' : 'One-time Deposit'}</div>
            </div>
            <div class="p-4 text-center">
              <span class="material-symbols-outlined text-error text-lg">cancel</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'EMI ബാധ്യത' : 'EMI Repayment Burden'}</div>
            </div>
          </div>

          <!-- Row: Risk Level -->
          <div class="grid grid-cols-4 border-b border-outline-variant/10 hover:bg-outline-variant/5 transition-colors">
            <div class="p-4 text-xs font-semibold text-on-surface-variant border-r border-outline-variant/10 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-outline shrink-0">warning</span>
              {language === 'ml' ? 'റിസ്ക്' : 'Risk Level'}
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-primary text-lg">radio_button_checked</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ഫോർമാൻ / ഡിഫോൾട്ട്' : 'Foreman/Default Risk'}</div>
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-secondary text-lg">check_circle</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'DICGC ഉറപ്പ്' : 'DICGC Insured'}</div>
            </div>
            <div class="p-4 text-center">
              <span class="material-symbols-outlined text-error text-lg">cancel</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">{language === 'ml' ? 'ഉയർന്ന പലിശ നിരക്ക്' : 'High Interest Rate'}</div>
            </div>
          </div>

          <!-- Row: Regulation -->
          <div class="grid grid-cols-4 hover:bg-outline-variant/5 transition-colors">
            <div class="p-4 text-xs font-semibold text-on-surface-variant border-r border-outline-variant/10 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-outline shrink-0">gavel</span>
              {language === 'ml' ? 'നിയന്ത്രണം' : 'Regulation'}
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-primary text-lg">radio_button_checked</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">Chit Funds Act 1982</div>
            </div>
            <div class="p-4 text-center border-r border-outline-variant/10">
              <span class="material-symbols-outlined text-secondary text-lg">check_circle</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">RBI {language === 'ml' ? 'നിയന്ത്രണം' : 'Regulated'}</div>
            </div>
            <div class="p-4 text-center">
              <span class="material-symbols-outlined text-secondary text-lg">check_circle</span>
              <div class="text-[9px] text-on-surface-variant mt-1 font-medium">RBI / NBFC</div>
            </div>
          </div>

          <!-- Legend footer -->
          <div class="p-4 bg-outline-variant/5 border-t border-outline-variant/20 text-center">
            <div class="flex flex-wrap gap-4 justify-center text-[10px] font-semibold text-on-surface-variant">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-secondary text-sm">check_circle</span>
                {language === 'ml' ? 'ഗുണകരം' : 'Advantageous'}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-primary text-sm">radio_button_checked</span>
                {language === 'ml' ? 'ഭേദം' : 'Moderate'}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-error text-sm">cancel</span>
                {language === 'ml' ? 'ദോഷകരം' : 'Disadvantageous'}
              </span>
            </div>
            <p class="text-[9px] text-on-surface-variant mt-2 opacity-70">
              {language === 'ml' ? '* വിദ്യാഭ്യാസ ആവശ്യത്തിന് മാത്രം. യഥാർത്ഥ വ്യവസ്ഥകൾ വ്യത്യസ്തമാകാം.' : '* Simplified for educational purposes. Actual terms vary by provider.'}
            </p>
          </div>

        </div>
      </section>

      <!-- FAQ SECTION -->
      <section class="space-y-6">
        <div class="text-center space-y-2">
          <h2 class="font-headline-md text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            {language === 'ml' ? 'പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p class="text-on-surface-variant text-xs md:text-sm font-semibold">
            {language === 'ml' ? 'ചിട്ടിയെക്കുറിച്ചുള്ള നിങ്ങളുടെ സംശയങ്ങൾക്കുള്ള മറുപടികൾ' : 'Common questions answered in simple terms.'}
          </p>
        </div>

        <div class="space-y-4 max-w-4xl mx-auto">
          {#each faqItems as faq (faq.id)}
            <div class="glass-card rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm">
              <button
                class="w-full p-5 text-left font-bold text-xs md:text-sm text-on-surface flex justify-between items-center cursor-pointer transition-colors hover:bg-outline-variant/10 focus:outline-none"
                onclick={() => toggleFAQ(faq.id)}
                aria-expanded={expandedFaqs[faq.id]}
              >
                <span>{language === 'ml' ? faq.questionMl : faq.questionEn}</span>
                <span class="material-symbols-outlined text-primary transition-transform duration-300 {expandedFaqs[faq.id] ? 'rotate-180' : ''}">
                  expand_more
                </span>
              </button>
              {#if expandedFaqs[faq.id]}
                <div 
                  transition:slide={{ duration: 250 }} 
                  class="p-5 border-t border-outline-variant/20 dark:border-white/5 bg-outline-variant/5 dark:bg-black/10 text-xs text-on-surface-variant leading-relaxed font-semibold"
                >
                  {language === 'ml' ? faq.answerMl : faq.answerEn}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>

      <!-- Educational Disclaimer Section -->
      <div class="max-w-4xl mx-auto w-full text-center">
        <div class="p-5 rounded-2xl bg-outline-variant/5 dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 text-xs text-on-surface-variant leading-relaxed font-medium">
          <span class="font-bold text-primary block mb-1">
            {language === 'ml' ? 'ഡിസ്‌ക്ലൈമർ / മുന്നറിയിപ്പ്' : 'Disclaimer'}
          </span>
          {language === 'ml' 
            ? 'ഈ ആപ്ലിക്കേഷൻ വിദ്യാഭ്യാസപരവും വിവരശേഖരണപരവുമായ ആവശ്യങ്ങൾക്ക് മാത്രമുള്ളതാണ്. യഥാർത്ഥ ചിട്ടി വ്യവസ്ഥകൾ, ലേല നിയമങ്ങൾ, ചാർജുകൾ, ഡിവിഡന്റുകൾ, ജാമ്യ വ്യവസ്ഥകൾ എന്നിവ ഓരോ ചിട്ടി കരാറുകൾക്കും ബാധകമായ നിയമങ്ങൾക്കും അനുസരിച്ച് വ്യത്യാസപ്പെടാം.'
            : 'This application is for educational and informational purposes only. Actual chit terms, auction rules, charges, dividends, security requirements and other conditions may vary according to the specific chit agreement and applicable laws/regulations.'}
        </div>
      </div>

    </div>

    <!-- Footer -->
    <footer class="mt-auto py-8 border-t border-outline-variant/20 dark:border-white/5 text-center text-outline-variant text-[11px] font-medium leading-relaxed bg-background/20 backdrop-blur-sm relative z-10">
      <p>© 2026 {language === 'ml' ? 'സബ്സ്റ്റിറ്റ്യൂഷൻ ചിട്ടി & ലോൺ കാൽക്കുലേറ്റർ ഡാഷ്‌ബോർഡ്' : 'Substitution Chitty & Loan Calculator Dashboard'}.</p>
      <p class="mt-1 opacity-70">{language === 'ml' ? 'Svelte 5-ലും പ്രീമിയം ഗ്ലാസ്മോർഫിസം രൂപകൽപ്പനയിലും നിർമ്മിച്ചത്' : 'Powered by Svelte 5 and Premium Glassmorphism shift aesthetics'}.</p>
    </footer>
  </main>
</div>
