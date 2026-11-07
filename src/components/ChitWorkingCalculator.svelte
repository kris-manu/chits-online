<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade, slide, fly } from "svelte/transition";
  import Tooltip from "./chit/Tooltip.svelte";

  // State variables (Svelte 5 Runes)
  let chitValue = $state(1000000); // 10 Lakhs default
  let totalMonths = $state(40); // 40 Months default
  let maxDiscountPercent = $state(30); // 30% KSFE / standard ceiling
  let foremanCommissionPercent = $state(5); // 5% legal ceiling
  let selectedClaimMonth = $state(15); // Inspected claim month
  let activeChartTab = $state("installments"); // 'installments' | 'prizemoney'
  let theme = $state("light");
  let language = $state("ml"); // Default to Malayalam
  let showAdvanced = $state(false);
  let searchTerm = $state("");
  let page = $state(1);
  const pageSize = 12;

  // Hover state for interactive graph scrubber
  let hoveredMonth = $state(null);

  // Translations
  const t = $derived({
    title: language === "ml" ? "ചിട്ടി പ്രവർത്തന കാൽക്കുലേറ്റർ" : "Chit Working & Lifecycle Calculator",
    subtitle: language === "ml" 
      ? "മാസങ്ങളും ചിട്ടി തുകയും നൽകി ലേലവും ഡിവിഡന്റും ഗ്രാഫിലൂടെ ലളിതമായി മനസ്സിലാക്കൂ" 
      : "Enter months & chit value to simulate monthly auctions, dividends, and cash flows with interactive graphs",
    chitParams: language === "ml" ? "ചിട്ടി വിവരങ്ങൾ" : "Chit Parameters",
    chitValue: language === "ml" ? "ചിട്ടി തുക (Chit Amount)" : "Chit Scheme Value",
    totalMonths: language === "ml" ? "ആകെ മാസങ്ങൾ (Months)" : "Total Duration (Months)",
    claimMonth: language === "ml" ? "ചിട്ടി വിളിക്കുന്ന മാസം (Bid Month)" : "Target Bid / Claim Month",
    discountCeiling: language === "ml" ? "പരമാവധി ലേല ഡിസ്കൗണ്ട്" : "Max Auction Discount Ceiling",
    foremanCommission: language === "ml" ? "ഫോർമാൻ കമ്മീഷൻ" : "Foreman Commission",
    grossInstallment: language === "ml" ? "യഥാർത്ഥ മാസത്തവണ (Gross)" : "Gross Monthly Installment",
    avgNetInstallment: language === "ml" ? "ശരാശരി അടവ് (Net Avg)" : "Avg. Net Monthly Installment",
    totalDividends: language === "ml" ? "ആകെ ഡിവിഡന്റ് ലാഭം" : "Total Dividends Earned",
    totalInvested: language === "ml" ? "ആകെ അടയ്ക്കേണ്ട തുക" : "Total Lifetime Investment",
    netPrizePayout: language === "ml" ? "ലഭിക്കുന്ന സമ്മാന തുക" : "Net Prize Money Received",
    netGainOrCost: language === "ml" ? "ലാഭം / ചെലവ് (Net Outcome)" : "Net Financial Outcome",
    breakEven: language === "ml" ? "ബ്രേക്ക്-ഈവൻ മാസം" : "Break-Even Month",
    chartTab1: language === "ml" ? "പ്രതിമാസ അടവും ഡിവിഡന്റും" : "Monthly Payment & Dividend Curve",
    chartTab2: language === "ml" ? "സമ്മാനത്തുകയും ആകെ അടവും" : "Prize Money vs Total Investment",
    scheduleTitle: language === "ml" ? "പ്രതിമാസ പ്രവർത്തന പട്ടിക" : "Month-by-Month Lifecycle Breakdown",
    searchPlaceholder: language === "ml" ? "മാസമോ വിവരങ്ങളോ തിരയുക..." : "Search month or details...",
    learnBasics: language === "ml" ? "ചിട്ടി പദങ്ങൾ" : "Chit Basics",
    advancedCalc: language === "ml" ? "സബ്സ്റ്റിറ്റ്യൂഷൻ & EMI" : "Substitution & EMI",
    winnerPhase: language === "ml" ? "വായ്പാ ഘട്ടം (Borrowing Phase)" : "Borrowing / Liquidity Phase",
    saverPhase: language === "ml" ? "സമ്പാദ്യ ഘട്ടം (Savings Phase)" : "Wealth / Savings Phase",
    breakEvenVerdict: language === "ml" ? "തുല്യ ഘട്ടം (Break-Even Phase)" : "Equilibrium Phase",
    downloadReport: language === "ml" ? "വിവരങ്ങൾ" : "Details",
  });

  // Clamp selected month when duration changes
  $effect(() => {
    if (selectedClaimMonth > totalMonths) {
      selectedClaimMonth = totalMonths;
    }
    if (selectedClaimMonth < 1) {
      selectedClaimMonth = 1;
    }
  });

  // Format INR Currency
  function formatCurrency(val) {
    if (val === null || val === undefined || isNaN(val)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  }

  // Number abbreviator (e.g. 10 Lakhs, 50k)
  function formatCompact(val) {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  }

  // Lifecycle Calculation Model
  const lifecycleData = $derived.by(() => {
    const V = Math.max(10000, Number(chitValue) || 100000);
    const N = Math.max(2, Math.min(120, Number(totalMonths) || 40));
    const maxDisc = Math.max(10, Math.min(50, Number(maxDiscountPercent) || 30));
    const commRate = (Number(foremanCommissionPercent) || 5) / 100;
    const grossInstallment = V / N;
    const foremanFee = commRate * V;

    // Ceiling months: early months where auction hits max discount ceiling
    // Usually first ~28% of months have fierce competition
    const ceilingMonths = Math.max(1, Math.round(N * 0.28));

    const rows = [];
    let cumulativeInvested = 0;
    let totalDividends = 0;

    for (let m = 1; m <= N; m++) {
      let discountAmount = 0;
      let discountPct = 0;

      if (m === 1) {
        // Month 1 is Foreman's Chit (Full chit value without auction discount)
        discountAmount = 0;
        discountPct = 0;
      } else if (m === N) {
        // Final Month: No auction, last subscriber takes full chit
        discountAmount = 0;
        discountPct = 0;
      } else {
        // Months 2 to N-1
        if (m <= ceilingMonths) {
          discountPct = maxDisc;
        } else {
          // Linear decay from maxDisc down to 2.5% at month N-1
          const factor = (m - ceilingMonths) / Math.max(1, (N - 1 - ceilingMonths));
          discountPct = maxDisc * (1 - factor) + 2.5 * factor;
        }
        discountAmount = (discountPct / 100) * V;
      }

      // Dividend pool: discount minus foreman's commission
      const dividendPool = Math.max(0, discountAmount - foremanFee);
      const dividendPerMember = dividendPool / N;
      const netPayment = Math.max(0, grossInstallment - dividendPerMember);

      cumulativeInvested += netPayment;
      totalDividends += dividendPerMember;

      // Prize money if winning this month
      let prizeMoney = 0;
      if (m === 1) {
        prizeMoney = V - foremanFee; // Foreman took month 1
      } else if (m === N) {
        prizeMoney = V - foremanFee; // Final subscriber
      } else {
        prizeMoney = Math.max(0, V - discountAmount);
      }

      rows.push({
        month: m,
        grossInstallment,
        discountPct,
        discountAmount,
        foremanFee,
        dividendPool,
        dividendPerMember,
        netPayment,
        cumulativeInvested,
        prizeMoney,
      });
    }

    const totalInvested = cumulativeInvested;
    const avgNetInstallment = totalInvested / N;

    // Calculate net gain/loss for each month's bid
    const enrichedRows = rows.map((r) => {
      const netGain = r.prizeMoney - totalInvested;
      const isBorrowing = netGain < 0;
      return {
        ...r,
        netGain,
        isBorrowing,
      };
    });

    // Find break-even month (first month where prizeMoney >= totalInvested)
    let breakEvenMonth = N;
    for (let i = 0; i < enrichedRows.length; i++) {
      if (enrichedRows[i].prizeMoney >= totalInvested) {
        breakEvenMonth = enrichedRows[i].month;
        break;
      }
    }

    return {
      V,
      N,
      grossInstallment,
      foremanFee,
      totalDividends,
      totalInvested,
      avgNetInstallment,
      breakEvenMonth,
      rows: enrichedRows,
    };
  });

  // Inspected Claim Month Detail
  const inspectedMonthData = $derived.by(() => {
    const m = Math.max(1, Math.min(lifecycleData.N, selectedClaimMonth));
    const row = lifecycleData.rows[m - 1] || lifecycleData.rows[0];
    const paidBefore = row.cumulativeInvested;
    const paidAfter = Math.max(0, lifecycleData.totalInvested - paidBefore);
    const netGain = row.netGain;
    const isProfit = netGain >= 0;

    // Approximate APR / Annualized Yield
    // For borrowing: effective annual cost on money received early
    // For savings: effective annual return on installment discipline
    let annualRatePct = 0;
    if (m > 1 && m < lifecycleData.N) {
      if (!isProfit) {
        const remainingMonths = lifecycleData.N - m;
        const principal = row.prizeMoney;
        const totalExtraPaid = Math.abs(netGain);
        const years = remainingMonths / 12;
        annualRatePct = years > 0 ? (totalExtraPaid / principal / years) * 100 : 0;
      } else {
        const principalInvested = lifecycleData.totalInvested;
        const gain = netGain;
        const years = lifecycleData.N / 12;
        annualRatePct = years > 0 ? (gain / principalInvested / years) * 100 : 0;
      }
    }

    return {
      ...row,
      paidBefore,
      paidAfter,
      isProfit,
      annualRatePct: Math.min(50, Math.max(0, annualRatePct)),
    };
  });

  // Animated numbers
  const tweenedTotalInvested = tweened(0, { duration: 400, easing: cubicOut });
  const tweenedPrizeMoney = tweened(0, { duration: 400, easing: cubicOut });
  const tweenedTotalDividends = tweened(0, { duration: 400, easing: cubicOut });

  $effect(() => {
    tweenedTotalInvested.set(lifecycleData.totalInvested);
    tweenedPrizeMoney.set(inspectedMonthData.prizeMoney);
    tweenedTotalDividends.set(lifecycleData.totalDividends);
  });

  // SVG Chart Geometry
  const chartGeometry = $derived.by(() => {
    const rows = lifecycleData.rows;
    const N = lifecycleData.N;
    const width = 800;
    const height = 300;
    const padding = { top: 30, right: 35, bottom: 45, left: 70 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Installment Chart Scales
    const maxInstallment = lifecycleData.grossInstallment * 1.15;
    const minInstallment = Math.min(...rows.map((r) => r.netPayment)) * 0.85;

    const xPos = (m) => padding.left + ((m - 1) / Math.max(1, N - 1)) * chartW;
    const yInstallment = (val) =>
      padding.top +
      chartH -
      ((val - minInstallment) / Math.max(1, maxInstallment - minInstallment)) * chartH;

    // Generate Path for Net Installment
    let netLinePath = "";
    let areaPath = "";
    rows.forEach((r, idx) => {
      const x = xPos(r.month);
      const y = yInstallment(r.netPayment);
      if (idx === 0) {
        netLinePath = `M ${x} ${y}`;
        areaPath = `M ${x} ${yInstallment(r.grossInstallment)} L ${x} ${y}`;
      } else {
        netLinePath += ` L ${x} ${y}`;
        areaPath += ` L ${x} ${y}`;
      }
    });

    // Close area back along the Gross Installment Line (to highlight the dividend gap)
    for (let i = rows.length - 1; i >= 0; i--) {
      const x = xPos(rows[i].month);
      const y = yInstallment(rows[i].grossInstallment);
      areaPath += ` L ${x} ${y}`;
    }
    areaPath += " Z";

    const grossY = yInstallment(lifecycleData.grossInstallment);

    // Prize Money vs Investment Chart Scales
    const maxVal = lifecycleData.V * 1.05;
    const minVal = 0;
    const yVal = (val) => padding.top + chartH - ((val - minVal) / Math.max(1, maxVal - minVal)) * chartH;

    let prizeLinePath = "";
    let prizeAreaPath = "";
    rows.forEach((r, idx) => {
      const x = xPos(r.month);
      const y = yVal(r.prizeMoney);
      if (idx === 0) {
        prizeLinePath = `M ${x} ${y}`;
        prizeAreaPath = `M ${x} ${yVal(lifecycleData.totalInvested)} L ${x} ${y}`;
      } else {
        prizeLinePath += ` L ${x} ${y}`;
        prizeAreaPath += ` L ${x} ${y}`;
      }
    });

    for (let i = rows.length - 1; i >= 0; i--) {
      const x = xPos(rows[i].month);
      const y = yVal(lifecycleData.totalInvested);
      prizeAreaPath += ` L ${x} ${y}`;
    }
    prizeAreaPath += " Z";

    const investedY = yVal(lifecycleData.totalInvested);
    const breakEvenX = xPos(lifecycleData.breakEvenMonth);
    const selectedX = xPos(selectedClaimMonth);

    return {
      width,
      height,
      padding,
      chartW,
      chartH,
      xPos,
      grossY,
      netLinePath,
      areaPath,
      yInstallment,
      yVal,
      investedY,
      prizeLinePath,
      prizeAreaPath,
      breakEvenX,
      selectedX,
      maxInstallment,
      minInstallment,
    };
  });

  // Filtered Table Rows
  const filteredRows = $derived.by(() => {
    let list = lifecycleData.rows;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.month.toString().includes(q) ||
          r.netPayment.toString().includes(q) ||
          r.prizeMoney.toString().includes(q)
      );
    }
    return list;
  });

  const paginatedRows = $derived.by(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  });

  const totalPages = $derived(Math.ceil(filteredRows.length / pageSize) || 1);

  // Canvas particle background
  let canvas;
  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = 42;
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2.2 + 1;
        this.isNavy = Math.random() > 0.45;
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
        if (this.isNavy) {
          ctx.fillStyle = theme === "dark" ? "rgba(74, 159, 245, 0.45)" : "rgba(15, 44, 89, 0.28)";
        } else {
          ctx.fillStyle = theme === "dark" ? "rgba(16, 232, 145, 0.45)" : "rgba(0, 143, 88, 0.28)";
        }
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

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 130) * 0.12;
            const useNavy = particles[i].isNavy || particles[j].isNavy;
            ctx.strokeStyle =
              theme === "dark"
                ? useNavy
                  ? `rgba(74, 159, 245, ${alpha})`
                  : `rgba(16, 232, 145, ${alpha})`
                : useNavy
                  ? `rgba(15, 44, 89, ${alpha})`
                  : `rgba(0, 143, 88, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - dist / 180) * 0.22;
            ctx.strokeStyle =
              theme === "dark"
                ? particles[i].isNavy
                  ? `rgba(74, 159, 245, ${alpha})`
                  : `rgba(16, 232, 145, ${alpha})`
                : particles[i].isNavy
                  ? `rgba(15, 44, 89, ${alpha})`
                  : `rgba(0, 143, 88, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            particles[i].x -= dx * 0.008;
            particles[i].y -= dy * 0.008;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

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
</script>

<canvas id="bg-canvas" bind:this={canvas}></canvas>

<div class="min-h-screen text-on-background font-body-md antialiased overflow-x-hidden relative">
  <!-- Glowing Background Orbs in Emerald & Navy -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div
      class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/15 dark:bg-primary/10 blur-[130px] animate-pulse-glow"
    ></div>
    <div
      class="absolute bottom-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-secondary/20 dark:bg-secondary/10 blur-[120px] animate-pulse-glow animate-float-slow"
    ></div>
    <div
      class="absolute top-[45%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/10 dark:bg-secondary/5 blur-[120px] animate-aurora pointer-events-none"
    ></div>
  </div>

  <main class="min-h-screen flex flex-col relative z-10">
    <!-- Top Header Bar -->
    <header
      class="flex justify-between items-center w-full px-4 lg:px-12 h-18 sticky top-0 z-40 bg-background/60 backdrop-blur-3xl border-b border-outline-variant/30"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-xl shiny-btn flex items-center justify-center text-on-primary shadow-md hover:scale-105 transition-transform"
        >
          <span class="material-symbols-outlined font-bold text-lg">auto_graph</span>
        </div>
        <span class="font-headline-md text-base md:text-xl font-bold tracking-tight text-primary">
          {t.title}
        </span>

        <div class="hidden sm:flex items-center gap-2 ml-4">
          <a
            href="/"
            class="px-3 py-1.5 rounded-xl bg-outline-variant/20 hover:bg-outline-variant/35 text-on-surface-variant hover:text-primary border border-outline-variant/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95 group"
          >
            <span class="material-symbols-outlined text-sm font-bold group-hover:rotate-12 transition-transform">menu_book</span>
            <span>{t.learnBasics}</span>
          </a>
          <a
            href="/calculator"
            class="px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/25 hover:border-secondary/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95 group"
          >
            <span class="material-symbols-outlined text-sm font-bold group-hover:rotate-12 transition-transform">calculate</span>
            <span>{t.advancedCalc}</span>
          </a>
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <!-- Language Selector -->
        <div class="flex p-0.5 bg-outline-variant/15 dark:bg-white/5 rounded-xl border border-outline-variant/30 dark:border-white/10 relative overflow-hidden w-28 md:w-32 shadow-inner shrink-0">
          <div
            class="absolute top-0.5 bottom-0.5 left-0.5 rounded-lg bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out z-0 shadow"
            style="width: calc(50% - 2px); transform: translateX({language === 'ml' ? '0%' : '100%'});"
          ></div>
          <button
            type="button"
            class="flex-1 py-1 text-center text-[9px] md:text-[10px] font-bold rounded-lg transition-all duration-300 z-10 cursor-pointer {language === 'ml' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
            onclick={() => {
              language = "ml";
              localStorage.setItem("app-lang", "ml");
            }}
          >
            മലയാളം
          </button>
          <button
            type="button"
            class="flex-1 py-1 text-center text-[9px] md:text-[10px] font-bold rounded-lg transition-all duration-300 z-10 cursor-pointer {language === 'en' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
            onclick={() => {
              language = "en";
              localStorage.setItem("app-lang", "en");
            }}
          >
            English
          </button>
        </div>

        <!-- Dark/Light Theme Switcher -->
        <button
          class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-outline-variant/25 dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary/40 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
          onclick={() => {
            theme = theme === "dark" ? "light" : "dark";
          }}
          aria-label="Toggle Theme"
        >
          {#if theme === "dark"}
            <span class="material-symbols-outlined text-sm md:text-lg animate-float text-secondary">light_mode</span>
          {:else}
            <span class="material-symbols-outlined text-sm md:text-lg animate-float text-primary">dark_mode</span>
          {/if}
        </button>
      </div>
    </header>

    <!-- Content Container -->
    <div class="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      
      <!-- HERO HEADER -->
      <section class="glass-card rounded-3xl p-6 lg:p-10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left max-w-2xl">
          <span class="text-on-surface-variant font-label-sm uppercase tracking-[0.2em] text-xs font-bold bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full text-primary border border-primary/20">
            {language === 'ml' ? 'ചിട്ടി സിമുലേറ്റർ' : 'Chit Fund Simulator'}
          </span>
          <h1 class="font-headline-lg text-2xl lg:text-4xl font-bold tracking-tight gradient-text">
            {t.title}
          </h1>
          <p class="text-on-surface-variant text-xs md:text-sm font-medium leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <!-- Quick Highlight Card -->
        <div class="glass-card p-5 rounded-2xl border border-secondary/30 shadow-lg flex items-center gap-4 shrink-0 bg-secondary/5">
          <div class="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-2xl">savings</span>
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-outline-variant">{t.totalDividends}</div>
            <div class="font-data-mono text-xl lg:text-2xl font-bold text-secondary text-glow-navy">
              {formatCurrency($tweenedTotalDividends)}
            </div>
            <div class="text-[10px] text-primary font-semibold">
              {((lifecycleData.totalDividends / lifecycleData.V) * 100).toFixed(1)}% {language === 'ml' ? 'ലാഭം' : 'saved via dividends'}
            </div>
          </div>
        </div>
      </section>

      <!-- MAIN CALCULATOR INPUTS & LIVE METRICS -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Input Controls (Left: 5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <div class="glass-card interactive-card p-6 lg:p-8 rounded-3xl space-y-6 shadow-2xl border border-outline-variant/30">
            <div class="flex justify-between items-center border-b border-outline-variant/20 pb-4">
              <h2 class="font-headline-md text-primary text-lg font-bold flex items-center gap-2">
                <span class="material-symbols-outlined text-xl">tune</span>
                {t.chitParams}
              </h2>
              <button
                type="button"
                class="text-xs font-semibold text-secondary hover:underline cursor-pointer flex items-center gap-1"
                onclick={() => showAdvanced = !showAdvanced}
              >
                <span>{showAdvanced ? (language === 'ml' ? 'ലളിതം' : 'Hide') : (language === 'ml' ? 'കൂടുതൽ' : 'Advanced')}</span>
                <span class="material-symbols-outlined text-sm">{showAdvanced ? 'expand_less' : 'expand_more'}</span>
              </button>
            </div>

            <!-- Chit Amount Input -->
            <div class="space-y-2.5">
              <div class="flex justify-between items-center">
                <label for="chit-val-input" class="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                  <span>{t.chitValue}</span>
                  <Tooltip id="cwChitVal" language={language} mlText="ചിട്ടിയുടെ ആകെ തുക" text="Total gross value of the chit scheme" link="/#chit-value" />
                </label>
                <span class="font-data-mono text-primary font-bold text-base lg:text-lg">
                  {formatCurrency(chitValue)}
                </span>
              </div>
              <input
                id="chit-val-range"
                type="range"
                min="50000"
                max="10000000"
                step="50000"
                bind:value={chitValue}
                class="w-full"
              />
              <!-- Presets -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                {#each [100000, 250000, 500000, 1000000, 2500000, 5000000] as opt}
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase border transition-all cursor-pointer preset-badge-hover {chitValue === opt ? 'bg-primary/20 border-primary text-primary shadow-sm' : 'bg-transparent border-outline-variant/30 text-on-surface-variant hover:border-secondary hover:text-secondary'}"
                    onclick={() => chitValue = opt}
                  >
                    {formatCompact(opt)}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Months Duration Input -->
            <div class="space-y-2.5 border-t border-outline-variant/20 pt-4">
              <div class="flex justify-between items-center">
                <label for="chit-months-input" class="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                  <span>{t.totalMonths}</span>
                  <Tooltip id="cwMonths" language={language} mlText="ചിട്ടി നീണ്ടുനിൽക്കുന്ന മാസങ്ങളുടെ എണ്ണം" text="Total months duration of the chit fund" link="/#chit-value" />
                </label>
                <span class="font-data-mono text-secondary font-bold text-base lg:text-lg">
                  {totalMonths} {language === 'ml' ? 'മാസം' : 'Months'}
                </span>
              </div>
              <input
                id="chit-months-range"
                type="range"
                min="12"
                max="120"
                step="1"
                bind:value={totalMonths}
                class="w-full"
              />
              <!-- Presets -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                {#each [25, 30, 40, 50, 60, 100] as opt}
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase border transition-all cursor-pointer preset-badge-hover {totalMonths === opt ? 'bg-secondary/20 border-secondary text-secondary shadow-sm' : 'bg-transparent border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary'}"
                    onclick={() => totalMonths = opt}
                  >
                    {opt} {language === 'ml' ? 'മാസം' : 'M'}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Target Bid Month Scrubber -->
            <div class="space-y-2.5 border-t border-outline-variant/20 pt-4 bg-primary/5 p-4 rounded-2xl border border-primary/20">
              <div class="flex justify-between items-center">
                <label for="claim-month-range" class="text-xs font-bold text-primary flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm">flag</span>
                  <span>{t.claimMonth}</span>
                </label>
                <span class="font-data-mono text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                  {language === 'ml' ? 'മാസം' : 'Month'} {selectedClaimMonth} / {totalMonths}
                </span>
              </div>
              <input
                id="claim-month-range"
                type="range"
                min="1"
                max={totalMonths}
                step="1"
                bind:value={selectedClaimMonth}
                class="w-full"
              />
              <div class="flex justify-between text-[10px] text-on-surface-variant font-medium">
                <span>{language === 'ml' ? 'ആദ്യ ലേലം (മാസം 1)' : 'Month 1 (Foreman)'}</span>
                <span class="text-secondary font-bold">
                  {language === 'ml' ? 'ബ്രേക്ക്-ഈവൻ:' : 'Break-Even:'} {language === 'ml' ? 'മാസം' : 'M'}{lifecycleData.breakEvenMonth}
                </span>
                <span>{language === 'ml' ? 'അവസാന മാസം' : 'Final Month'} ({totalMonths})</span>
              </div>
            </div>

            <!-- Optional Advanced Controls -->
            {#if showAdvanced}
              <div transition:slide={{ duration: 250 }} class="space-y-4 pt-3 border-t border-outline-variant/20 text-xs">
                <div>
                  <div class="flex justify-between text-on-surface-variant font-semibold mb-1">
                    <span>{t.discountCeiling}</span>
                    <span class="font-data-mono font-bold text-on-surface">{maxDiscountPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="40"
                    step="1"
                    bind:value={maxDiscountPercent}
                    class="w-full"
                  />
                  <span class="text-[10px] text-outline font-medium block">KSFE {language === 'ml' ? 'സാധാരണ' : 'standard'} 25% - 30%</span>
                </div>

                <div>
                  <div class="flex justify-between text-on-surface-variant font-semibold mb-1">
                    <span>{t.foremanCommission}</span>
                    <span class="font-data-mono font-bold text-on-surface">{foremanCommissionPercent}% ({formatCurrency(lifecycleData.foremanFee)})</span>
                  </div>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="flex-1 py-1 rounded-lg border text-xs font-bold {foremanCommissionPercent === 5 ? 'bg-primary/20 border-primary text-primary' : 'border-outline-variant/30 text-on-surface-variant'}"
                      onclick={() => foremanCommissionPercent = 5}
                    >
                      5% (Chit Funds Act 1982)
                    </button>
                    <button
                      type="button"
                      class="flex-1 py-1 rounded-lg border text-xs font-bold {foremanCommissionPercent === 7 ? 'bg-primary/20 border-primary text-primary' : 'border-outline-variant/30 text-on-surface-variant'}"
                      onclick={() => foremanCommissionPercent = 7}
                    >
                      7%
                    </button>
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <!-- Inspected Bid Month Decision Card -->
          <div class="glass-card interactive-card p-6 rounded-3xl border border-secondary/30 shadow-xl space-y-4 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
                  <span class="material-symbols-outlined text-base">military_tech</span>
                </div>
                <h3 class="font-headline-md text-sm lg:text-base font-bold text-on-surface">
                  {language === 'ml' ? `മാസം ${selectedClaimMonth}-ൽ ചിട്ടി വിളിച്ചാൽ` : `Winning Bid in Month ${selectedClaimMonth}`}
                </h3>
              </div>
              <span class="font-data-mono text-xs font-bold px-2 py-0.5 rounded-lg {inspectedMonthData.isProfit ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-error/15 text-error border border-error/30'}">
                {inspectedMonthData.isProfit ? t.saverPhase : t.winnerPhase}
              </span>
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-2 gap-3 text-xs pt-1">
              <div class="p-3 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/20">
                <span class="text-[10px] text-outline font-semibold uppercase block">{t.netPrizePayout}</span>
                <span class="font-data-mono font-bold text-base text-primary text-glow-green">
                  {formatCurrency(inspectedMonthData.prizeMoney)}
                </span>
                <span class="text-[9px] text-on-surface-variant block mt-0.5">
                  ({inspectedMonthData.discountPct.toFixed(1)}% {language === 'ml' ? 'ഡിസ്കൗണ്ട്' : 'discount'})
                </span>
              </div>

              <div class="p-3 rounded-2xl bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/20">
                <span class="text-[10px] text-outline font-semibold uppercase block">{t.netGainOrCost}</span>
                <span class="font-data-mono font-bold text-base {inspectedMonthData.isProfit ? 'text-primary' : 'text-error'}">
                  {inspectedMonthData.isProfit ? '+' : ''}{formatCurrency(inspectedMonthData.netGain)}
                </span>
                <span class="text-[9px] text-on-surface-variant block mt-0.5">
                  {inspectedMonthData.isProfit ? (language === 'ml' ? 'ലാഭ വരുമാനം' : 'Investment Return') : (language === 'ml' ? 'വായ്പാ ചെലവ്' : 'Borrowing Cost')}
                </span>
              </div>
            </div>

            <!-- Progress bar of payments -->
            <div class="space-y-1.5 pt-2 border-t border-outline-variant/20">
              <div class="flex justify-between text-[11px] font-semibold text-on-surface-variant">
                <span>{language === 'ml' ? 'മുൻപടവ്:' : 'Paid Prior:'} {formatCurrency(inspectedMonthData.paidBefore)}</span>
                <span>{language === 'ml' ? 'ബാക്കി അടവ്:' : 'Future Remaining:'} {formatCurrency(inspectedMonthData.paidAfter)}</span>
              </div>
              <div class="h-2 rounded-full bg-outline-variant/20 overflow-hidden flex">
                <div
                  class="bg-secondary transition-all duration-300"
                  style="width: {(inspectedMonthData.paidBefore / lifecycleData.totalInvested) * 100}%"
                ></div>
                <div
                  class="bg-primary/50 transition-all duration-300"
                  style="width: {(inspectedMonthData.paidAfter / lifecycleData.totalInvested) * 100}%"
                ></div>
              </div>
            </div>

            <!-- Takeaway note -->
            <p class="text-[11px] text-on-surface-variant leading-relaxed font-medium">
              {#if selectedClaimMonth === 1}
                {language === 'ml' ? 'ആദ്യ മാസം ഫോർമാൻ കമ്മീഷൻ മാത്രം കുറച്ച് മുഴുവൻ തുകയും ലഭിക്കുന്നു.' : 'Month 1 is the Foreman Chit, paying the full amount minus foreman commission.'}
              {:else if selectedClaimMonth < lifecycleData.breakEvenMonth}
                {language === 'ml'
                  ? `മാസം ${selectedClaimMonth}-ൽ ചിട്ടി വിളിക്കുന്നത് ബിസിനസ്സിനോ അത്യാവശ്യങ്ങൾക്കോ കുറഞ്ഞ പലിശയ്ക്ക് പണം ലഭ്യമാക്കാനുള്ള വായ്പയായി കണക്കാക്കാം.`
                  : `Claiming in month ${selectedClaimMonth} acts as early liquidity / loan with an approximate borrowing cost of ${formatCurrency(Math.abs(inspectedMonthData.netGain))}.`}
              {:else if selectedClaimMonth === lifecycleData.breakEvenMonth}
                {language === 'ml'
                  ? 'ഇതാണ് ബ്രേക്ക്-ഈവൻ മാസം! നിങ്ങൾ ആകെ അടച്ച തുകയും കൈപ്പറ്റിയ സമ്മാനത്തുകയും തുല്യമാകുന്നു.'
                  : 'This is the Break-Even Month! Total lifetime payments equal the prize money collected.'}
              {:else}
                {language === 'ml'
                  ? `മാസം ${selectedClaimMonth}-ൽ വിളിക്കുമ്പോൾ ${formatCurrency(inspectedMonthData.netGain)} ലാഭം ലഭിക്കുന്നു. മികച്ച സമ്പാദ്യ നേട്ടം!`
                  : `Claiming in month ${selectedClaimMonth} yields an attractive surplus of ${formatCurrency(inspectedMonthData.netGain)} on disciplined savings.`}
              {/if}
            </p>
          </div>
        </div>

        <!-- Graphs & Key Metrics Dashboard (Right: 7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Key 4-Stat Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="glass-card p-4 rounded-2xl border border-outline-variant/30 text-center">
              <span class="text-[10px] text-outline font-bold uppercase tracking-wider block">{t.grossInstallment}</span>
              <span class="font-data-mono font-bold text-sm lg:text-base text-on-surface block mt-1">
                {formatCurrency(lifecycleData.grossInstallment)}
              </span>
              <span class="text-[9px] text-outline-variant block mt-0.5">{language === 'ml' ? 'ഡിവിഡന്റ് ഇല്ലാതെ' : 'Without dividend'}</span>
            </div>

            <div class="glass-card p-4 rounded-2xl border border-primary/30 text-center bg-primary/5">
              <span class="text-[10px] text-primary font-bold uppercase tracking-wider block">{t.avgNetInstallment}</span>
              <span class="font-data-mono font-bold text-sm lg:text-base text-primary block mt-1">
                {formatCurrency(lifecycleData.avgNetInstallment)}
              </span>
              <span class="text-[9px] text-primary/80 block mt-0.5">{language === 'ml' ? 'യഥാർത്ഥ ശരാശരി' : 'Actual avg per month'}</span>
            </div>

            <div class="glass-card p-4 rounded-2xl border border-secondary/30 text-center bg-secondary/5">
              <span class="text-[10px] text-secondary font-bold uppercase tracking-wider block">{t.totalInvested}</span>
              <span class="font-data-mono font-bold text-sm lg:text-base text-secondary block mt-1">
                {formatCurrency(lifecycleData.totalInvested)}
              </span>
              <span class="text-[9px] text-secondary/80 block mt-0.5">{language === 'ml' ? 'ആകെ അടവ്' : 'Lifetime payments'}</span>
            </div>

            <div class="glass-card p-4 rounded-2xl border border-outline-variant/30 text-center">
              <span class="text-[10px] text-outline font-bold uppercase tracking-wider block">{t.breakEven}</span>
              <span class="font-data-mono font-bold text-sm lg:text-base text-on-surface block mt-1">
                {language === 'ml' ? 'മാസം' : 'Month'} {lifecycleData.breakEvenMonth}
              </span>
              <span class="text-[9px] text-outline-variant block mt-0.5">{((lifecycleData.breakEvenMonth / lifecycleData.N) * 100).toFixed(0)}% {language === 'ml' ? 'കാലാവധിയിൽ' : 'timeline'}</span>
            </div>
          </div>

          <!-- Interactive Graph Card -->
          <div class="glass-card p-6 lg:p-8 rounded-3xl space-y-4 shadow-2xl border border-outline-variant/30 relative">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 class="font-headline-md text-base lg:text-lg font-bold text-on-surface flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">show_chart</span>
                  <span>{activeChartTab === 'installments' ? t.chartTab1 : t.chartTab2}</span>
                </h3>
                <p class="text-xs text-on-surface-variant font-medium">
                  {language === 'ml' 
                    ? 'ഗ്രാഫിലെ ഏത് മാസത്തിലും ക്ലിക്ക് ചെയ്തോ മൗസ് വെച്ചോ വിശദാംശങ്ങൾ കാണാം' 
                    : 'Click or hover on any month along the curve to inspect calculations'}
                </p>
              </div>

              <!-- Graph View Tabs -->
              <div class="flex p-1 bg-outline-variant/15 dark:bg-white/5 rounded-xl border border-outline-variant/30 shrink-0">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer {activeChartTab === 'installments' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}"
                  onclick={() => activeChartTab = 'installments'}
                >
                  {language === 'ml' ? 'തവണ & ഡിവിഡന്റ്' : 'Installments'}
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer {activeChartTab === 'prizemoney' ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}"
                  onclick={() => activeChartTab = 'prizemoney'}
                >
                  {language === 'ml' ? 'ലേലത്തുക vs അടവ്' : 'Payout vs Cost'}
                </button>
              </div>
            </div>

            <!-- Responsive SVG Chart -->
            <div class="relative w-full overflow-hidden pt-2">
              <svg
                viewBox="0 0 {chartGeometry.width} {chartGeometry.height}"
                class="w-full h-64 lg:h-76 select-none overflow-visible"
              >
                <defs>
                  <!-- Emerald Dividend Savings Gradient -->
                  <linearGradient id="dividendShadingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="var(--color-secondary)" stop-opacity="0.08" />
                  </linearGradient>

                  <!-- Prize Money vs Invested Gradient -->
                  <linearGradient id="prizeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="var(--color-secondary)" stop-opacity="0.05" />
                  </linearGradient>
                </defs>

                <!-- Horizontal Reference Gridlines -->
                <line
                  x1={chartGeometry.padding.left}
                  y1={chartGeometry.padding.top}
                  x2={chartGeometry.width - chartGeometry.padding.right}
                  y2={chartGeometry.padding.top}
                  stroke="var(--color-outline-variant)"
                  stroke-opacity="0.2"
                  stroke-dasharray="3,3"
                />
                <line
                  x1={chartGeometry.padding.left}
                  y1={chartGeometry.padding.top + chartGeometry.chartH / 2}
                  x2={chartGeometry.width - chartGeometry.padding.right}
                  y2={chartGeometry.padding.top + chartGeometry.chartH / 2}
                  stroke="var(--color-outline-variant)"
                  stroke-opacity="0.2"
                  stroke-dasharray="3,3"
                />
                <line
                  x1={chartGeometry.padding.left}
                  y1={chartGeometry.padding.top + chartGeometry.chartH}
                  x2={chartGeometry.width - chartGeometry.padding.right}
                  y2={chartGeometry.padding.top + chartGeometry.chartH}
                  stroke="var(--color-outline-variant)"
                  stroke-opacity="0.4"
                />

                {#if activeChartTab === 'installments'}
                  <!-- Area Shading showing Dividend Benefit -->
                  <path d={chartGeometry.areaPath} fill="url(#dividendShadingGrad)" />

                  <!-- Gross Installment Benchmark Line -->
                  <line
                    x1={chartGeometry.padding.left}
                    y1={chartGeometry.grossY}
                    x2={chartGeometry.width - chartGeometry.padding.right}
                    y2={chartGeometry.grossY}
                    stroke="var(--color-outline)"
                    stroke-width="2"
                    stroke-dasharray="6,4"
                  />
                  <text
                    x={chartGeometry.padding.left + 8}
                    y={chartGeometry.grossY - 8}
                    fill="var(--color-outline)"
                    font-size="11"
                    font-weight="bold"
                  >
                    {language === 'ml' ? 'യഥാർത്ഥ തവണ:' : 'Gross Installment:'} {formatCurrency(lifecycleData.grossInstallment)}
                  </text>

                  <!-- Actual Net Monthly Installment Line -->
                  <path
                    d={chartGeometry.netLinePath}
                    fill="none"
                    stroke="var(--color-primary)"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    class="chart-glow"
                  />
                {:else}
                  <!-- Total Invested Benchmark Line -->
                  <line
                    x1={chartGeometry.padding.left}
                    y1={chartGeometry.investedY}
                    x2={chartGeometry.width - chartGeometry.padding.right}
                    y2={chartGeometry.investedY}
                    stroke="var(--color-secondary)"
                    stroke-width="2.5"
                    stroke-dasharray="6,4"
                  />
                  <text
                    x={chartGeometry.padding.left + 8}
                    y={chartGeometry.investedY - 8}
                    fill="var(--color-secondary)"
                    font-size="11"
                    font-weight="bold"
                  >
                    {language === 'ml' ? 'ആകെ അടവ്:' : 'Total Invested:'} {formatCurrency(lifecycleData.totalInvested)}
                  </text>

                  <!-- Prize Money Curve -->
                  <path
                    d={chartGeometry.prizeLinePath}
                    fill="none"
                    stroke="var(--color-primary)"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    class="chart-glow"
                  />

                  <!-- Break Even Pin -->
                  <circle
                    cx={chartGeometry.breakEvenX}
                    cy={chartGeometry.investedY}
                    r="6"
                    fill="var(--color-secondary)"
                    stroke="#ffffff"
                    stroke-width="2"
                    class="animate-ping"
                    style="animation-duration: 2.5s"
                  />
                  <circle
                    cx={chartGeometry.breakEvenX}
                    cy={chartGeometry.investedY}
                    r="5"
                    fill="var(--color-secondary)"
                    stroke="#ffffff"
                    stroke-width="2"
                  />
                  <text
                    x={chartGeometry.breakEvenX}
                    y={chartGeometry.investedY + 22}
                    fill="var(--color-secondary)"
                    font-size="10"
                    font-weight="bold"
                    text-anchor="middle"
                  >
                    {language === 'ml' ? 'ബ്രേക്ക്-ഈവൻ' : 'Break-Even'} ({lifecycleData.breakEvenMonth}M)
                  </text>
                {/if}

                <!-- Selected Month Cursor Pin Indicator -->
                <line
                  x1={chartGeometry.selectedX}
                  y1={chartGeometry.padding.top}
                  x2={chartGeometry.selectedX}
                  y2={chartGeometry.padding.top + chartGeometry.chartH}
                  stroke="var(--color-primary)"
                  stroke-width="2"
                  stroke-dasharray="3,3"
                />
                <circle
                  cx={chartGeometry.selectedX}
                  cy={activeChartTab === 'installments' ? chartGeometry.yInstallment(inspectedMonthData.netPayment) : chartGeometry.yVal(inspectedMonthData.prizeMoney)}
                  r="7"
                  fill="var(--color-primary)"
                  stroke="#ffffff"
                  stroke-width="2.5"
                  class="shadow-lg"
                />

                <!-- X Axis Months Markers -->
                {#each [1, Math.round(lifecycleData.N * 0.25), Math.round(lifecycleData.N * 0.5), Math.round(lifecycleData.N * 0.75), lifecycleData.N] as mTick}
                  <text
                    x={chartGeometry.xPos(mTick)}
                    y={chartGeometry.height - 12}
                    fill="var(--color-outline)"
                    font-size="11"
                    font-weight="bold"
                    text-anchor="middle"
                  >
                    M{mTick}
                  </text>
                {/each}

                <!-- Transparent Interactive Overlays for easy month selection by mouse click/hover -->
                {#each lifecycleData.rows as r}
                  <rect
                    x={chartGeometry.xPos(r.month) - (chartGeometry.chartW / lifecycleData.N) / 2}
                    y={chartGeometry.padding.top}
                    width={chartGeometry.chartW / lifecycleData.N}
                    height={chartGeometry.chartH}
                    fill="transparent"
                    class="cursor-pointer"
                    onclick={() => selectedClaimMonth = r.month}
                    onmouseenter={() => hoveredMonth = r.month}
                    onmouseleave={() => hoveredMonth = null}
                  />
                {/each}
              </svg>
            </div>

            <!-- Chart Legend -->
            <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-outline-variant/20 text-xs">
              <div class="flex items-center gap-4">
                {#if activeChartTab === 'installments'}
                  <div class="flex items-center gap-1.5">
                    <div class="w-3.5 h-1.5 rounded-full bg-primary"></div>
                    <span class="text-on-surface-variant font-semibold">{language === 'ml' ? 'അടയ്ക്കേണ്ട തുക (Net Installment)' : 'Actual Payment'}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3.5 h-1.5 rounded-full bg-outline border-t border-dashed"></div>
                    <span class="text-on-surface-variant font-semibold">{language === 'ml' ? 'മുഴുവൻ തുക (Gross)' : 'Gross (No Dividend)'}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3 h-3 rounded bg-primary/30"></div>
                    <span class="text-primary font-bold">{language === 'ml' ? 'ഡിവിഡന്റ് ലാഭം' : 'Dividend Savings Area'}</span>
                  </div>
                {:else}
                  <div class="flex items-center gap-1.5">
                    <div class="w-3.5 h-1.5 rounded-full bg-primary"></div>
                    <span class="text-on-surface-variant font-semibold">{language === 'ml' ? 'ലഭിക്കുന്ന സമ്മാനത്തുക' : 'Prize Money Curve'}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-3.5 h-1.5 rounded-full bg-secondary border-t border-dashed"></div>
                    <span class="text-on-surface-variant font-semibold">{language === 'ml' ? 'ആകെ അടവ്' : 'Total Invested'}</span>
                  </div>
                {/if}
              </div>

              <div class="text-right text-[11px] font-bold text-primary">
                {language === 'ml' ? 'തിരഞ്ഞെടുത്ത മാസം:' : 'Selected:'} {language === 'ml' ? 'മാസം' : 'Month'} {selectedClaimMonth}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MONTH-BY-MONTH DETAILED DATA TABLE -->
      <section class="space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-outline-variant/30 pb-3">
          <div>
            <h2 class="font-headline-md text-on-surface text-lg lg:text-xl font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">table_chart</span>
              <span>{t.scheduleTitle}</span>
            </h2>
            <p class="text-xs text-on-surface-variant font-medium mt-0.5">
              {language === 'ml' ? 'ഓരോ മാസത്തെയും ഡിസ്കൗണ്ടും ഡിവിഡന്റും കൈപ്പറ്റുന്ന തുകയും' : 'Complete month-by-month calculation ledger'}
            </p>
          </div>

          <!-- Search Filter -->
          <div class="flex items-center bg-outline-variant/15 dark:bg-white/5 border border-outline-variant/30 rounded-xl px-3 py-1.5 gap-2 w-full sm:w-64">
            <span class="material-symbols-outlined text-outline text-base">search</span>
            <input
              type="text"
              class="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-on-surface placeholder:text-outline-variant w-full p-0"
              placeholder={t.searchPlaceholder}
              bind:value={searchTerm}
            />
          </div>
        </div>

        <!-- Table Container -->
        <div class="glass-card rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead class="bg-outline-variant/20 dark:bg-white/5 border-b border-outline-variant/30">
                <tr class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                  <th class="px-5 py-3.5">{language === 'ml' ? 'മാസം' : 'Month'}</th>
                  <th class="px-5 py-3.5">{language === 'ml' ? 'ലേല ഡിസ്കൗണ്ട്' : 'Auction Discount'}</th>
                  <th class="px-5 py-3.5">{language === 'ml' ? 'ഡിവിഡന്റ്' : 'Dividend / Member'}</th>
                  <th class="px-5 py-3.5 text-primary">{language === 'ml' ? 'അടയ്ക്കേണ്ട തുക' : 'Net Payment'}</th>
                  <th class="px-5 py-3.5">{language === 'ml' ? 'ആകെ അടച്ചത്' : 'Cumulative Paid'}</th>
                  <th class="px-5 py-3.5 text-secondary">{language === 'ml' ? 'സമ്മാനത്തുക' : 'Prize Money'}</th>
                  <th class="px-5 py-3.5 text-right">{language === 'ml' ? 'നേട്ടം / ചെലവ്' : 'Net Benefit'}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/15 dark:divide-white/5 font-data-mono">
                {#each paginatedRows as row}
                  <tr
                    class="transition-colors cursor-pointer {row.month === selectedClaimMonth ? 'bg-primary/10 border-l-4 border-l-primary font-bold' : 'hover:bg-secondary/10 dark:hover:bg-secondary/15'}"
                    onclick={() => selectedClaimMonth = row.month}
                  >
                    <td class="px-5 py-3 font-bold text-on-surface">
                      M{row.month}
                      {#if row.month === 1}
                        <span class="text-[9px] text-outline font-normal ml-1">({language === 'ml' ? 'ഫോർമാൻ' : 'Foreman'})</span>
                      {:else if row.month === lifecycleData.breakEvenMonth}
                        <span class="text-[9px] text-secondary font-bold ml-1">★</span>
                      {/if}
                    </td>
                    <td class="px-5 py-3 text-on-surface-variant">
                      {formatCurrency(row.discountAmount)}
                      <span class="text-[10px] opacity-70">({row.discountPct.toFixed(0)}%)</span>
                    </td>
                    <td class="px-5 py-3 text-primary font-semibold">
                      +{formatCurrency(row.dividendPerMember)}
                    </td>
                    <td class="px-5 py-3 font-bold text-primary">
                      {formatCurrency(row.netPayment)}
                    </td>
                    <td class="px-5 py-3 text-on-surface-variant">
                      {formatCurrency(row.cumulativeInvested)}
                    </td>
                    <td class="px-5 py-3 font-bold text-secondary">
                      {formatCurrency(row.prizeMoney)}
                    </td>
                    <td class="px-5 py-3 text-right font-bold {row.isBorrowing ? 'text-error' : 'text-primary'}">
                      {row.isBorrowing ? '' : '+'}{formatCurrency(row.netGain)}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          {#if totalPages > 1}
            <div class="flex items-center justify-between px-6 py-3 border-t border-outline-variant/20 bg-outline-variant/5 text-xs">
              <span class="text-on-surface-variant font-medium">
                {language === 'ml' ? `പേജ് ${page} / ${totalPages}` : `Page ${page} of ${totalPages}`}
              </span>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="px-3 py-1 rounded-lg border border-outline-variant/30 disabled:opacity-30 cursor-pointer font-bold"
                  disabled={page === 1}
                  onclick={() => page = Math.max(1, page - 1)}
                >
                  {language === 'ml' ? 'മുൻപിലത്തെ' : 'Previous'}
                </button>
                <button
                  type="button"
                  class="px-3 py-1 rounded-lg border border-outline-variant/30 disabled:opacity-30 cursor-pointer font-bold"
                  disabled={page === totalPages}
                  onclick={() => page = Math.min(totalPages, page + 1)}
                >
                  {language === 'ml' ? 'അടുത്തത്' : 'Next'}
                </button>
              </div>
            </div>
          {/if}
        </div>
      </section>

      <!-- EDUCATIONAL HOW IT WORKS INFO BOXES -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div class="glass-card interactive-card p-6 rounded-3xl border border-outline-variant/30 space-y-2">
          <div class="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-2">
            <span class="material-symbols-outlined">payments</span>
          </div>
          <h3 class="font-headline-md text-sm font-bold text-on-surface">
            {language === 'ml' ? '1. പ്രതിമാസ പൂളിംഗ്' : '1. Monthly Pooling'}
          </h3>
          <p class="text-xs text-on-surface-variant leading-relaxed font-medium">
            {language === 'ml'
              ? `${lifecycleData.N} അംഗങ്ങൾ ചേർന്ന് ഓരോ മാസവും തുല്യമായ തവണ അടയ്ക്കുന്നു. ആകെ ${formatCurrency(lifecycleData.V)} രൂപ പ്രതിമാസം ശേഖരിക്കപ്പെടുന്നു.`
              : `${lifecycleData.N} subscribers contribute each month, creating a shared monthly pool of ${formatCurrency(lifecycleData.V)}.`}
          </p>
        </div>

        <div class="glass-card interactive-card p-6 rounded-3xl border border-outline-variant/30 space-y-2">
          <div class="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary mb-2">
            <span class="material-symbols-outlined">gavel</span>
          </div>
          <h3 class="font-headline-md text-sm font-bold text-on-surface">
            {language === 'ml' ? '2. ലേലവും ഡിസ്കൗണ്ടും' : '2. Reverse Auction & Discount'}
          </h3>
          <p class="text-xs text-on-surface-variant leading-relaxed font-medium">
            {language === 'ml'
              ? 'പണം ആവശ്യമുള്ള അംഗങ്ങൾ ഡിസ്കൗണ്ട് ലേലം വിളിക്കുന്നു. പരമാവധി ഡിസ്കൗണ്ട് കിഴിച്ച് ബാക്കി തുക ലേലവിജയിക്ക് നൽകുന്നു.'
              : 'Subscribers bid by sacrificing a discount for early payout. The winner takes the net pool immediately.'}
          </p>
        </div>

        <div class="glass-card interactive-card p-6 rounded-3xl border border-outline-variant/30 space-y-2">
          <div class="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-2">
            <span class="material-symbols-outlined">pie_chart</span>
          </div>
          <h3 class="font-headline-md text-sm font-bold text-on-surface">
            {language === 'ml' ? '3. ഡിവിഡന്റ് വിതരണം' : '3. Equal Dividend Distribution'}
          </h3>
          <p class="text-xs text-on-surface-variant leading-relaxed font-medium">
            {language === 'ml'
              ? 'ഫോർമാൻ കമ്മീഷൻ കുറച്ചുള്ള ബാക്കി ഡിസ്കൗണ്ട് മുഴുവൻ അംഗങ്ങൾക്കും തുല്യമായി ലഭിക്കുന്നു. ഇത് അടുത്ത മാസത്തെ അടവ് കുറയ്ക്കുന്നു.'
              : 'The remaining discount (after 5% foreman fee) is split equally among all members, lowering their next installment.'}
          </p>
        </div>
      </section>

    </div>

    <!-- Footer -->
    <footer class="mt-auto py-8 border-t border-outline-variant/20 dark:border-white/5 text-center text-outline-variant text-[11px] font-medium leading-relaxed bg-background/30 backdrop-blur-sm relative z-10">
      <p>© 2026 {language === 'ml' ? 'സബ്സ്റ്റിറ്റ്യൂഷൻ ചിട്ടി & കാൽക്കുലേറ്റർ ഡാഷ്‌ബോർഡ്' : 'Substitution Chitty & Working Calculator'}.</p>
      <p class="mt-1 opacity-70">{language === 'ml' ? 'വിദ്യാഭ്യാസ ആവശ്യങ്ങൾക്കായി മാത്രം നിർമ്മിച്ചത്' : 'Designed for educational financial literacy'}.</p>
    </footer>
  </main>
</div>

