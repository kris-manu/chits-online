<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade, slide, fly } from "svelte/transition";
  import Tooltip from "./chit/Tooltip.svelte";

  // State variables (Svelte 5 Runes)
  let calculatorMode = $state("substitution"); // Default to 'substitution'
  let theme = $state("light");
  let language = $state("ml"); // Default to Malayalam as primary

  // Bilingual translation dictionary
  const translations = {
    ml: {
      title: "സബ്സ്റ്റിറ്റ്യൂഷൻ ചിട്ടി",
      calculatorMode: "കാൽക്കുലേറ്റർ മോഡ്",
      chittySub: "ചിട്ടി സബ്സ്റ്റിറ്റ്യൂഷൻ",
      loanEmi: "ലോൺ ഇ.എം.ഐ (EMI)",
      subDetails: "സബ്സ്റ്റിറ്റ്യൂഷൻ വിവരങ്ങൾ",
      loanParams: "ലോൺ വിവരങ്ങൾ",
      adjustValues: "മൂല്യങ്ങൾ ക്രമീകരിക്കുക",
      chitValue: "ചിട്ടി തുക (Chit Value)",
      totalMonths: "ആകെ മാസങ്ങൾ (N)",
      joinMonth: "ചേരുന്ന മാസം (k)",
      subAmount: "സബ്സ്റ്റിറ്റ്യൂഷൻ തുക (Buy-in)",
      lastAuctionAmount: "അവസാന ലേല തുക",
      avgPastDiscount: "കഴിഞ്ഞ ശരാശരി ഡിസ്കൗണ്ട്",
      expFutureDiscount: "പ്രതീക്ഷിക്കുന്ന ഭാവി ഡിസ്കൗണ്ട്",
      expBidClaimMonth: "ചിട്ടി വിളിക്കാൻ ഉദ്ദേശിക്കുന്ന മാസം",
      recalculate: "വീണ്ടും കണക്കുകൂട്ടുക",
      estimatedEmi: "പ്രതിമാസ തവണ (EMI)",
      compoundYield: "വാർഷിക നേട്ടം (Annualized IRR)",
      marginRatio: "അനുപാതം (Ratio)",
      buyInJoinCost: "ചേരാനുള്ള തുക (Join Cost)",
      futureContributions: "ഭാവി തവണകൾ",
      expectedProfit: "പ്രതീക്ഷിക്കുന്ന ലാഭം",
      netPrizePayout: "ലഭിക്കുന്ന സമ്മാന തുക",
      principalAmount: "ലോൺ തുക (Principal)",
      totalInterest: "ആകെ പലിശ (Interest)",
      totalRepayment: "ആകെ തിരിച്ചടവ്",
      outstandingPrincipal: "ബാക്കിയുള്ള ലോൺ തുക",
      breakEven: "ബ്രേക്ക് ഈവൻ",
      cashFlowMilestone: "ചിട്ടിയിലെ പണമിടപാടുകൾ",
      requestEnrolment: "ചിട്ടിയിൽ ചേരുവാൻ അപേക്ഷിക്കുക",
      downloadPdf: "PDF ഡൗൺലോഡ് ചെയ്യുക",
      searchSchedule: "തിരയുക...",
      monthIndex: "മാസം",
      transactionMilestone: "ഇടപാട് വിവരങ്ങൾ",
      cashFlow: "പണമിടപാട് (+/-)",
      cumulativePosition: "ആകെ സാമ്പത്തിക നില",
      details: "വിശദാംശങ്ങൾ",
      year: "വർഷം",
      openingBalance: "തുടക്കത്തിലെ ബാക്കി",
      interestPaid: "അടച്ച പലിശ",
      principalPaid: "അടച്ച അസ്സൽ",
      closingBalance: "അവസാനത്തെ ബാക്കി",
      monthlyBreakdown: "പ്രതിമാസ വിവരങ്ങൾ",
      month: "മാസം",
      previous: "മുൻപിലത്തെ",
      next: "അടുത്തത്",
      // Quick tips
      tipTitleSub: "സബ്സ്റ്റിറ്റ്യൂഷൻ ലാഭവിവരം",
      tipDescSub: "ചിട്ടിയിലെ പണമിടപാടുകൾ കണക്കിലെടുത്ത് നിങ്ങളുടെ നിക്ഷേപത്തിന്റെ യഥാർത്ഥ വാർഷിക വളർച്ചയാണ് IRR പ്രതിനിധീകരിക്കുന്നത്.",
      tipTitleEmi: "തിരിച്ചടവ് വിവരങ്ങൾ",
      tipDescEmi: "വർഷങ്ങൾ കഴിയുംതോറും അസ്സൽ തുക വേഗത്തിൽ കുറയുന്നു, കാരണം പലിശ കുറഞ്ഞു വരുന്നു.",
      // Tooltips
      chitValueTooltip: "ചിട്ടിയിലെ എല്ലാ തവണകളും ചേർത്തുണ്ടാകുന്ന ആകെ തുകയാണിത്. ഉദാഹരണത്തിന്, 25,000 രൂപ വീതം 100 മാസം അടയ്ക്കുന്ന ചിട്ടിയുടെ ആകെ തുക 25 ലക്ഷം രൂപയാണ്.",
      monthlyInstallmentTooltip: "ഓരോ മാസവും ഒരു ചിട്ടി അംഗം അടയ്ക്കേണ്ട തുകയാണിത്. ചിട്ടിയുടെ ആകെ തുകയെ ആകെ മാസങ്ങൾ കൊണ്ട് ഹരിച്ചാണ് ഇത് കണക്കാക്കുന്നത്.",
      discountTooltip: "ചിട്ടി ലേലം വിളിക്കുമ്പോൾ ആകെ ചിട്ടി തുകയിൽ നിന്നും കുറയ്ക്കുന്ന തുകയാണിത്. ഇത് പിന്നീട് ചിട്ടി അംഗങ്ങൾക്ക് വീതിച്ചു നൽകുന്നു.",
      dividendTooltip: "ചിട്ടി ലേലം വിളിക്കുമ്പോൾ ഉണ്ടാകുന്ന ഡിസ്കൗണ്ട് തുക അംഗങ്ങൾക്ക് വീതിച്ചു നൽകുന്ന ലാഭവിഹിതമാണിത്. ഇത് ഓരോ മാസത്തെയും അടവ് തുക കുറയ്ക്കാൻ സഹായിക്കുന്നു.",
      prizeMoneyTooltip: "ലേലം ജയിച്ച ചിട്ടി അംഗത്തിന് ഫോർമാൻ കമ്മീഷനും മറ്റ് നിയമപരമായ കിഴിവുകൾക്കും ശേഷം ലഭിക്കുന്ന യഥാർത്ഥ തുകയാണിത്.",
      foremanCommissionTooltip: "ചിട്ടി നടത്തിപ്പുകാരനായ ഫോർമാൻ (ഉദാ: KSFE) ചിട്ടി നിയന്ത്രിക്കുന്നതിനായി ഈടാക്കുന്ന കമ്മീഷൻ തുകയാണിത് (സാധാരണയായി 5%).",
    },
    en: {
      title: "Substitution Chitty",
      calculatorMode: "Calculator Mode",
      chittySub: "Chitty Substitution",
      loanEmi: "Loan EMI Mode",
      subDetails: "Substitution Details",
      loanParams: "Loan Parameters",
      adjustValues: "Adjust values to calculate instantly",
      chitValue: "Chit Scheme Value",
      totalMonths: "Total Months (N)",
      joinMonth: "Join Month (k)",
      subAmount: "Substitution Amount (Buy-in)",
      lastAuctionAmount: "Last Auction Amount",
      avgPastDiscount: "Avg. Past Discount",
      expFutureDiscount: "Expected Future Discount",
      expBidClaimMonth: "Expected Bid Claim Month",
      recalculate: "Re-calculate Scenario",
      estimatedEmi: "Estimated Monthly Installment (EMI)",
      compoundYield: "Compound Yield (Annualized IRR)",
      marginRatio: "Margin : Ratio",
      buyInJoinCost: "Buy-in (Join Cost)",
      futureContributions: "Future Contributions",
      expectedProfit: "Expected Profit",
      netPrizePayout: "Net Prize Payout",
      principalAmount: "Principal Amount",
      totalInterest: "Total Interest",
      totalRepayment: "Total Repayment",
      outstandingPrincipal: "Outstanding Principal Curve",
      breakEven: "Break Even",
      cashFlowMilestone: "Substitution Cash Flow Milestone",
      requestEnrolment: "Request Subscriber Enrolment",
      downloadPdf: "Export PDF",
      searchSchedule: "Search schedule...",
      monthIndex: "Month Index",
      transactionMilestone: "Transaction / Milestone",
      cashFlow: "Cash Outflow/Inflow",
      cumulativePosition: "Cumulative Position",
      details: "Details",
      year: "Year",
      openingBalance: "Opening Balance",
      interestPaid: "Interest Paid",
      principalPaid: "Principal Paid",
      closingBalance: "Closing Balance",
      monthlyBreakdown: "Monthly Breakdown",
      month: "Month",
      previous: "Previous",
      next: "Next",
      // Quick tips
      tipTitleSub: "Substitution Yield Details",
      tipDescSub: "IRR represents the true compound growth of your investments considering the net inflows.",
      tipTitleEmi: "Amortization Overview",
      tipDescEmi: "Outstanding principal decreases faster in later years due to compound reduction.",
      // Tooltips
      chitValueTooltip: "The total value of the chit scheme. For example, if the monthly installment is ₹25,000 for 100 months, the gross chit value is ₹25,00,000.",
      monthlyInstallmentTooltip: "The amount each subscriber contributes in every round/month. It is calculated as Chit Value divided by the total number of months.",
      discountTooltip: "The amount by which the chit value is reduced during the auction. The winning bidder foregoes this amount, which is then distributed as dividend.",
      dividendTooltip: "The share of the auction discount distributed among all subscribers, which reduces their monthly installment amount.",
      prizeMoneyTooltip: "The actual amount received by the auction winner after deducting the foreman's commission and the auction discount.",
      foremanCommissionTooltip: "The fee charged by the chit manager (foreman) for organizing and running the chit, typically a fixed percentage like 5% of the chit value.",
    }
  };

  const t = $derived(translations[language]);


  // EMI Mode parameters
  let rate = $state(8.5);
  let tenure = $state(20);

  // Currency config (INR only now)
  const currencyConfigs = {
    INR: {
      symbol: "₹",
      locale: "en-IN",
      default: 2500000,
      options: [1000000, 2500000, 5000000, 7500000, 10000000],
    }
  };

  let amount = $state(currencyConfigs["INR"].default);

  // Chit Fund parameters
  let chitValue = $state(1000000); // Total Chit Scheme Value
  let chitMonths = $state(50); // Total rounds
  let currentMonth = $state(15); // Month of substitution
  let avgDiscountPercent = $state(25); // Average discount so far
  let futureDiscountPercent = $state(15); // Expected future discount
  let claimMonth = $state(30); // When the substitute plans to bid/claim

  // Additional parameters for direct inputs
  let lastAuctionAmount = $state(850000);
  let substitutionAmount = $state(225000);

  // Sync sliders -> text inputs on parameter change
  $effect(() => {
    const totalFace = currentMonth * (chitValue / chitMonths);
    const expectedSub = totalFace * (1 - avgDiscountPercent / 100);
    
    // Only update if there is a meaningful difference to avoid cursor jumping
    if (Math.abs(substitutionAmount - expectedSub) > 1) {
      substitutionAmount = Math.round(expectedSub);
    }
  });

  $effect(() => {
    const expectedLast = chitValue * (1 - futureDiscountPercent / 100);
    if (Math.abs(lastAuctionAmount - expectedLast) > 1) {
      lastAuctionAmount = Math.round(expectedLast);
    }
  });

  // Derived configurations
  const config = $derived(currencyConfigs["INR"]);

  // --- EMI CALCULATIONS ---
  const r = $derived(rate / 12 / 100);
  const n = $derived(tenure * 12);
  const emi = $derived(
    r > 0
      ? (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : amount / n
  );
  const totalPayment = $derived(emi * n);
  const totalInterest = $derived(totalPayment - amount);
  const interestPercent = $derived(
    totalPayment > 0 ? Math.round((totalInterest / totalPayment) * 100) : 0
  );
  const principalPercent = $derived(100 - interestPercent);

  // --- CHIT SUBSTITUTION CALCULATIONS ---
  const chitM = $derived(chitValue / chitMonths); // Monthly installment
  const chitCostJoin = $derived(
    currentMonth * chitM * (1 - avgDiscountPercent / 100)
  ); // Cost to join
  const chitCostFuture = $derived(
    (chitMonths - currentMonth) * chitM * (1 - futureDiscountPercent / 100)
  ); // Future payments
  const chitTotalPaid = $derived(chitCostJoin + chitCostFuture);
  const chitPrizeMoney = $derived(
    chitValue * (1 - futureDiscountPercent / 100 - 0.05)
  ); // 5% Foreman commission
  const chitNetProfit = $derived(chitPrizeMoney - chitTotalPaid);

  const chitCostPercent = $derived(
    chitPrizeMoney > 0
      ? Math.max(0, Math.min(100, (chitTotalPaid / chitPrizeMoney) * 100))
      : 100
  );
  const chitProfitPercent = $derived(100 - chitCostPercent);

  // Secant Method Solver for Internal Rate of Return (IRR)
  const chitIrr = $derived.by(() => {
    const cfs = [];
    cfs.push(-chitCostJoin);
    const monthsRemaining = chitMonths - currentMonth;
    const futureM = chitM * (1 - futureDiscountPercent / 100);

    for (let t = 1; t <= monthsRemaining; t++) {
      let cf = -futureM;
      if (t === claimMonth - currentMonth) {
        cf += chitPrizeMoney;
      }
      cfs.push(cf);
    }

    if (cfs[0] >= 0) return 0;

    // IRR Solver
    let r0 = 0.001;
    let r1 = 0.1;
    let f0 = calculateNPV(cfs, r0);
    let f1 = calculateNPV(cfs, r1);
    let maxIt = 100;
    let tol = 1e-6;

    for (let i = 0; i < maxIt; i++) {
      if (Math.abs(f1 - f0) < 1e-12) break;
      let r2 = r1 - (f1 * (r1 - r0)) / (f1 - f0);
      let f2 = calculateNPV(cfs, r2);

      if (Math.abs(f2) < tol) {
        let ann = (Math.pow(1 + r2, 12) - 1) * 100;
        return isNaN(ann) || !isFinite(ann) ? 0 : ann;
      }

      r0 = r1;
      f0 = f1;
      r1 = r2;
      f1 = f2;
    }

    // Fallback Simple ROI Annualized
    if (chitTotalPaid <= 0) return 0;
    return (
      (chitNetProfit / chitTotalPaid) *
      100 *
      (12 / (chitMonths - currentMonth))
    );
  });

  function calculateNPV(cfs, rate) {
    let npv = 0;
    for (let t = 0; t < cfs.length; t++) {
      npv += cfs[t] / Math.pow(1 + rate, t);
    }
    return npv;
  }

  // --- MOTION TWEENING STORES FOR SMOOTH TRANSITIONS ---
  const emiTweened = tweened(0, { duration: 400, easing: cubicOut });
  const totalInterestTweened = tweened(0, { duration: 400, easing: cubicOut });
  const totalPaymentTweened = tweened(0, { duration: 400, easing: cubicOut });
  const principalPercentTweened = tweened(0, {
    duration: 500,
    easing: cubicOut,
  });
  const interestPercentTweened = tweened(0, { duration: 500, easing: cubicOut });

  // Chit tweens
  const chitCostJoinTweened = tweened(0, { duration: 400, easing: cubicOut });
  const chitCostFutureTweened = tweened(0, { duration: 400, easing: cubicOut });
  const chitPrizeMoneyTweened = tweened(0, { duration: 400, easing: cubicOut });
  const chitNetProfitTweened = tweened(0, { duration: 400, easing: cubicOut });
  const chitIrrTweened = tweened(0, { duration: 400, easing: cubicOut });

  // Runes effect to update tweened values
  $effect(() => {
    if (calculatorMode === "emi") {
      emiTweened.set(emi);
      totalInterestTweened.set(totalInterest);
      totalPaymentTweened.set(totalPayment);
      principalPercentTweened.set(principalPercent);
      interestPercentTweened.set(interestPercent);
    } else {
      chitCostJoinTweened.set(chitCostJoin);
      chitCostFutureTweened.set(chitCostFuture);
      chitPrizeMoneyTweened.set(chitPrizeMoney);
      chitNetProfitTweened.set(chitNetProfit);
      chitIrrTweened.set(chitIrr);
      principalPercentTweened.set(chitCostPercent);
      interestPercentTweened.set(chitProfitPercent);
    }
  });

  // Clamping dependencies in Chit Fund parameter adjustments
  $effect(() => {
    if (currentMonth >= chitMonths) {
      currentMonth = chitMonths - 1;
    }
    if (claimMonth <= currentMonth) {
      claimMonth = currentMonth + 1;
    }
    if (claimMonth > chitMonths) {
      claimMonth = chitMonths;
    }
  });

  // Formatting helpers
  function formatCurrency(value, showDecimal = false) {
    const fractionDigits = showDecimal ? 2 : 0;
    const formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(Math.round(value));

    return `₹${formatted}`;
  }

  // Schedule Generators
  function calculateAmortizationSchedule(principal, annualRate, years) {
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    const monthlyEmi =
      monthlyRate > 0
        ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
        : principal / months;

    let balance = principal;
    const schedule = [];

    for (let year = 1; year <= years; year++) {
      let interestPaidThisYear = 0;
      let principalPaidThisYear = 0;
      const openingBalance = balance;
      const monthlyDetails = [];

      for (let month = 1; month <= 12; month++) {
        const monthNum = (year - 1) * 12 + month;
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyEmi - interestPayment;

        interestPaidThisYear += interestPayment;
        principalPaidThisYear += principalPayment;
        const startBal = balance;
        balance -= principalPayment;

        monthlyDetails.push({
          month: monthNum,
          openingBalance: startBal,
          interestPaid: interestPayment,
          principalPaid: principalPayment,
          closingBalance: Math.max(0, balance),
        });
      }

      if (year === years || balance < 0) {
        balance = 0;
      }

      schedule.push({
        year,
        openingBalance,
        interestPaid: interestPaidThisYear,
        principalPaid: principalPaidThisYear,
        closingBalance: balance,
        months: monthlyDetails,
        expanded: false,
      });
    }
    return schedule;
  }

  function calculateChittySchedule(val, totalM, curM, avgD, futD, bidM) {
    const monthlyM = val / totalM;
    const buyIn = curM * monthlyM * (1 - avgD / 100);
    const futM = monthlyM * (1 - futD / 100);
    const prize = val * (1 - futD / 100 - 0.05);

    const schedule = [];
    let cumulative = -buyIn;

    schedule.push({
      monthText: `Month ${curM} (Join)`,
      description: "Substitution buy-in / past installments settlement",
      amount: -buyIn,
      cumulative: cumulative,
      type: "buyin",
      expanded: false,
      details: `Calculated as: ${curM} months x ${formatCurrency(monthlyM)} face value - ${avgD}% average dividend.`,
    });

    const monthsRemaining = totalM - curM;
    for (let t = 1; t <= monthsRemaining; t++) {
      const monthNum = curM + t;
      let netFlow = -futM;
      let desc = "Monthly Contribution Payment";
      let type = "payment";
      let detailText = `Calculated as: ${formatCurrency(monthlyM)} face value - ${futD}% expected dividend.`;

      if (monthNum === bidM) {
        netFlow += prize;
        desc = "Prize Money Claimed (Bid Winning)";
        type = "prize";
        detailText = `Subscribed month contribution: -${formatCurrency(futM)}. Prize money claimed: ${formatCurrency(prize)} (face value ${formatCurrency(val)} - ${futD}% bid discount - 5% commission).`;
      }

      cumulative += netFlow;

      schedule.push({
        monthText: `Month ${monthNum}`,
        description: desc,
        amount: netFlow,
        cumulative: cumulative,
        type: type,
        expanded: false,
        details: detailText,
      });
    }

    return schedule;
  }

  // Schedules (Reactive to changes)
  const amortizationSchedule = $derived(
    calculateAmortizationSchedule(amount, rate, tenure)
  );
  const chittySchedule = $derived(
    calculateChittySchedule(
      chitValue,
      chitMonths,
      currentMonth,
      avgDiscountPercent,
      futureDiscountPercent,
      claimMonth
    )
  );

  // Table Search and Pagination
  let searchTerm = $state("");
  let currentPage = $state(1);
  const pageSize = 8;

  // Track expanded state locally for Year rows
  let expandedRows = $state({});

  function toggleRow(id) {
    expandedRows[id] = !expandedRows[id];
  }

  $effect(() => {
    searchTerm;
    calculatorMode;
    currentPage = 1;
    expandedRows = {};
  });

  const filteredEmiSchedule = $derived.by(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return amortizationSchedule;
    return amortizationSchedule.filter((row) =>
      `year ${row.year}`.toLowerCase().includes(term)
    );
  });

  const filteredChitSchedule = $derived.by(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return chittySchedule;
    return chittySchedule.filter(
      (row) =>
        row.monthText.toLowerCase().includes(term) ||
        row.description.toLowerCase().includes(term)
    );
  });

  const paginatedEmiRows = $derived(
    filteredEmiSchedule.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  );

  const paginatedChitRows = $derived(
    filteredChitSchedule.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  );

  const totalPages = $derived.by(() => {
    const total =
      calculatorMode === "emi"
        ? filteredEmiSchedule.length
        : filteredChitSchedule.length;
    return Math.max(1, Math.ceil(total / pageSize));
  });

  // SVG Area Charts
  const emiChartPath = $derived.by(() => {
    const schedule = amortizationSchedule;
    if (schedule.length === 0) return { linePath: "", areaPath: "" };

    const width = 420;
    const height = 130;
    const paddingLeft = 15;
    const paddingRight = 15;
    const paddingTop = 15;
    const paddingBottom = 15;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    const points = [{ x: paddingLeft, y: paddingTop }];

    schedule.forEach((row, i) => {
      const x = paddingLeft + ((i + 1) / schedule.length) * chartW;
      const y = paddingTop + (1 - row.closingBalance / amount) * chartH;
      points.push({ x, y });
    });

    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

    return { linePath, areaPath, points };
  });

  const chittyChartPath = $derived.by(() => {
    const schedule = chittySchedule;
    if (schedule.length === 0)
      return { linePath: "", areaPath: "", zeroY: 0, points: [] };

    const width = 420;
    const height = 130;
    const paddingLeft = 15;
    const paddingRight = 15;
    const paddingTop = 15;
    const paddingBottom = 15;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    const minBal = Math.min(...schedule.map((r) => r.cumulative), 0);
    const maxBal = Math.max(...schedule.map((r) => r.cumulative), 100);
    const balRange = maxBal - minBal;

    const points = schedule.map((row, i) => {
      const x = paddingLeft + (i / (schedule.length - 1)) * chartW;
      const y = paddingTop + (1 - (row.cumulative - minBal) / balRange) * chartH;
      return { x, y };
    });

    const zeroY = paddingTop + (1 - (0 - minBal) / balRange) * chartH;

    let linePath = "";
    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        linePath += ` L ${points[i].x} ${points[i].y}`;
      }
    }

    const areaPath =
      points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
        : "";

    return { linePath, areaPath, zeroY, points };
  });

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

        // Mouse attraction
        if (mouse.x !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - dist / 180) * 0.12;
            ctx.strokeStyle =
              theme === "dark"
                ? `rgba(16, 185, 129, ${alpha})`
                : `rgba(0, 133, 86, ${alpha})`;
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

  $effect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  // Toast notification state
  let toastMessage = $state("");
  let showToast = $state(false);
  let toastTimeout;

  function triggerToast(message) {
    clearTimeout(toastTimeout);
    toastMessage = message;
    showToast = true;
    toastTimeout = setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  function handleApply() {
    triggerToast("Redirecting to subscriber eligibility portal...");
  }

  function handleExport() {
    triggerToast("Detailed amortization schedule exported successfully!");
  }
</script>

<canvas id="bg-canvas" bind:this={canvas}></canvas>

<div
  class="min-h-screen text-on-background font-body-md antialiased overflow-x-hidden relative"
>
  <!-- BACKGROUND DECOR GLOWS -->
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div
      class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] animate-pulse-glow"
    ></div>
    <div
      class="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-secondary/15 dark:bg-secondary/5 blur-[100px] animate-pulse-glow animate-float-slow"
    ></div>
  </div>

  <!-- TOAST NOTIFICATION -->
  {#if showToast}
    <div
      transition:fly={{ y: 20, duration: 300 }}
      class="fixed bottom-6 right-6 z-50 glass-card p-4 rounded-2xl shadow-xl border border-primary/30 flex items-center gap-3"
    >
      <div class="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
      <span class="text-sm font-semibold text-on-surface">{toastMessage}</span>
    </div>
  {/if}

  <!-- Main Content Area -->
  <main class="min-h-screen flex flex-col relative z-10">
    <!-- Top Bar -->
    <header
      class="flex justify-between items-center w-full px-4 lg:px-12 h-18 sticky top-0 z-40 bg-background/45 backdrop-blur-3xl border-b border-outline-variant/30"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-xl shiny-btn flex items-center justify-center text-on-primary shadow-md"
        >
          <span class="material-symbols-outlined font-bold text-lg"
            >account_balance</span
          >
        </div>
        <span class="font-headline-md text-base md:text-xl font-bold tracking-tight text-primary">
          {language === 'ml' ? 'ചിട്ടി കാൽക്കുലേറ്റർ' : 'Substitution Chitty'}
        </span>
        
        <a 
          href="/" 
          class="ml-2 md:ml-4 px-2.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 text-[10px] md:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <span class="material-symbols-outlined text-xs md:text-sm font-bold">menu_book</span>
          <span>{language === 'ml' ? 'ചിട്ടി പദങ്ങൾ' : 'Chit Basics'}</span>
        </a>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <div class="flex items-center gap-2">
          <!-- Language Selector -->
          <div class="flex p-0.5 bg-outline-variant/15 dark:bg-white/5 rounded-xl border border-outline-variant/30 dark:border-white/10 relative overflow-hidden w-28 md:w-32 shadow-inner shrink-0">
            <div 
              class="absolute top-0.5 bottom-0.5 left-0.5 rounded-lg bg-primary transition-all duration-300 ease-out z-0 shadow"
              style="width: calc(50% - 2px); transform: translateX({language === 'ml' ? '0%' : '100%'});"
            ></div>
            <button 
              type="button" 
              class="flex-1 py-1 text-center text-[9px] md:text-[10px] font-bold rounded-lg transition-all duration-300 z-10 cursor-pointer {language === 'ml' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
              onclick={() => {
                language = 'ml';
                localStorage.setItem('app-lang', 'ml');
                triggerToast('ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി');
              }}
            >
              മലയാളം
            </button>
            <button 
              type="button" 
              class="flex-1 py-1 text-center text-[9px] md:text-[10px] font-bold rounded-lg transition-all duration-300 z-10 cursor-pointer {language === 'en' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
              onclick={() => {
                language = 'en';
                localStorage.setItem('app-lang', 'en');
                triggerToast('Language switched to English');
              }}
            >
              English
            </button>
          </div>

          <!-- Dark/Light Theme Switcher -->
          <button
            class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-outline-variant/25 dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer active:scale-95 shadow-sm"
            onclick={() => {
              theme = theme === 'dark' ? 'light' : 'dark';
              triggerToast(language === 'ml' ? `തീം ${theme === 'dark' ? 'ഡാർക്ക്' : 'ലൈറ്റ്'} മോഡിലേക്ക് മാറ്റി` : `Theme switched to ${theme} mode`);
            }}
            aria-label="Toggle Theme"
          >
            {#if theme === 'dark'}
              <span class="material-symbols-outlined text-sm md:text-lg animate-float">light_mode</span>
            {:else}
              <span class="material-symbols-outlined text-sm md:text-lg animate-float">dark_mode</span>
            {/if}
          </button>

          <button
            class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-base md:text-xl hidden sm:inline-block"
            onclick={() => triggerToast(language === 'ml' ? "എല്ലാ സിസ്റ്റങ്ങളും സുരക്ഷിതമാണ്." : "All systems operational. No new alerts.")}
            >notifications</button
          >
          <div
            class="h-7.5 w-7.5 md:h-8.5 md:w-8.5 rounded-xl overflow-hidden border border-primary/30 shadow-sm hidden sm:block"
          >
            <img
              class="w-full h-full object-cover"
              alt="Advisor headshot"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYrmVflOCEjy-bwFgS9eDr7DJPZcrMYW2JJ2QvTlXn5attjDihW8TPEpNVt-5_UdqgB0uKnX5pMChDgiHW2kj02zO3MIPGQIDOQ-1aF0kFUbs6N7K2CdiuESddxiiygaV6_YaJR8uv3JwRrOhfWBxvnXpK1F9HUDP6UTSJzIxs5XsgMUaLgEsfzKWmPCUMv630N8PRcM0nhiOer0cbTaO5xPrfH4VWmbkjIeHaDacdxJKfiY8WnpyMwJUskpk-4hWej_jg8j8M7w"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Dashboard Body -->
    <div class="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      
      <!-- CALCULATOR MODE SELECTOR (Chitty Substitution First) -->
      <div class="flex p-1.5 bg-outline-variant/15 dark:bg-black/20 rounded-2xl border border-outline-variant/30 dark:border-white/10 backdrop-blur-md relative overflow-hidden max-w-md mx-auto shadow-inner">
        <div 
          class="absolute top-1.5 bottom-1.5 left-1.5 rounded-xl bg-primary transition-all duration-300 ease-out z-0 shadow-md"
          style="width: calc(50% - 6px); transform: translateX({calculatorMode === 'substitution' ? '0%' : '100%'});"
        ></div>
        <button 
          type="button" 
          class="flex-1 py-3 text-center text-sm font-semibold rounded-xl transition-all duration-300 z-10 cursor-pointer {calculatorMode === 'substitution' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
          onclick={() => calculatorMode = 'substitution'}
        >
          <div class="flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-lg">swap_horiz</span>
            {t.chittySub}
          </div>
        </button>
        <button 
          type="button" 
          class="flex-1 py-3 text-center text-sm font-semibold rounded-xl transition-all duration-300 z-10 cursor-pointer {calculatorMode === 'emi' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
          onclick={() => calculatorMode = 'emi'}
        >
          <div class="flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-lg">calculate</span>
            {t.loanEmi}
          </div>
        </button>
      </div>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Input Section (Left Card) -->
        <div class="lg:col-span-6 space-y-6">
          <div class="glass-card p-8 lg:p-10 rounded-3xl space-y-7 shadow-2xl relative">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="font-headline-md text-primary text-xl font-bold tracking-tight">
                  {#if calculatorMode === 'substitution'}
                    {t.subDetails}
                  {:else}
                    {t.loanParams}
                  {/if}
                </h2>
                <p class="text-on-surface-variant text-xs mt-1">{t.adjustValues}</p>
              </div>
              <span class="material-symbols-outlined text-primary/40 text-2xl">tune</span>
            </div>

            {#if calculatorMode === 'substitution'}
              <!-- ==================== CHITTY PARAMS ==================== -->
              <!-- Chit Scheme Value -->
              <div class="space-y-3" transition:fade={{ duration: 250 }}>
                <div class="flex justify-between items-center">
                  <label for="chit-value-input" class="font-label-sm text-on-surface-variant text-sm font-semibold flex items-center">
                    {t.chitValue}
                    <Tooltip id="chitValue" language={language} mlText={translations.ml.chitValueTooltip} text={translations.en.chitValueTooltip} link="/#chit-value" />
                  </label>
                  <span class="font-data-mono text-primary text-lg font-bold">{formatCurrency(chitValue)}</span>
                </div>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <input
                      id="chit-value-input"
                      type="number"
                      bind:value={chitValue}
                      min="10000"
                      max="100000000"
                      step="10000"
                      class="w-full bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/40 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                    />
                  </div>
                </div>
                <!-- Quick Amount Pills -->
                <div class="flex flex-wrap gap-2 pt-1">
                  {#each [100000, 500000, 1000000, 2500000, 5000000] as opt}
                    <button
                      type="button"
                      class="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase border transition-all cursor-pointer {chitValue === opt ? 'bg-primary/20 border-primary text-primary' : 'bg-transparent border-outline-variant/30 text-on-surface-variant hover:border-primary/50'}"
                      onclick={() => chitValue = opt}
                    >
                      {formatCurrency(opt)}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- Total Months & Substitution Month -->
              <div class="grid grid-cols-2 gap-4" transition:fade={{ duration: 250 }}>
                <div class="space-y-2">
                  <label for="chit-months" class="font-label-sm text-on-surface-variant text-xs font-semibold flex items-center">
                    {t.totalMonths}
                    <Tooltip id="chitPeriod" language={language} mlText={translations.ml.chitValueTooltip} text={translations.en.chitValueTooltip} link="/#chit-period" />
                  </label>
                  <select
                    id="chit-months"
                    bind:value={chitMonths}
                    class="w-full bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/40 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface outline-none"
                  >
                    <option value={30} class="bg-background text-on-background">{language === 'ml' ? '30 മാസം' : '30 Months'}</option>
                    <option value={40} class="bg-background text-on-background">{language === 'ml' ? '40 മാസം' : '40 Months'}</option>
                    <option value={50} class="bg-background text-on-background">{language === 'ml' ? '50 മാസം' : '50 Months'}</option>
                    <option value={100} class="bg-background text-on-background">{language === 'ml' ? '100 മാസം' : '100 Months'}</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <label for="sub-month" class="font-label-sm text-on-surface-variant text-xs font-semibold">Join Month (k)</label>
                    <span class="font-data-mono text-primary font-bold text-xs">M{currentMonth}</span>
                  </div>
                  <input
                    id="sub-month"
                    type="range"
                    min="1"
                    max={chitMonths - 1}
                    step="1"
                    bind:value={currentMonth}
                    class="w-full h-1 mt-2.5"
                  />
                </div>
              </div>

              <!-- Substitution Amount & Last Auction Amount -->
              <div class="grid grid-cols-2 gap-4" transition:fade={{ duration: 250 }}>
                <div class="space-y-2">
                  <label for="sub-amount-input" class="font-label-sm text-on-surface-variant text-xs font-semibold">Substitution Amount (Buy-in)</label>
                  <input
                    id="sub-amount-input"
                    type="number"
                    value={Math.round(substitutionAmount)}
                    oninput={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      substitutionAmount = val;
                      const totalFaceValue = currentMonth * (chitValue / chitMonths);
                      avgDiscountPercent = totalFaceValue > 0 ? ((totalFaceValue - val) / totalFaceValue) * 100 : 0;
                    }}
                    class="w-full bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/40 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface outline-none"
                  />
                </div>
                <div class="space-y-2">
                  <label for="last-auction-input" class="font-label-sm text-on-surface-variant text-xs font-semibold">Last Auction Amount</label>
                  <input
                    id="last-auction-input"
                    type="number"
                    value={Math.round(lastAuctionAmount)}
                    oninput={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      lastAuctionAmount = val;
                      futureDiscountPercent = chitValue > 0 ? ((chitValue - val) / chitValue) * 100 : 0;
                    }}
                    class="w-full bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/40 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface outline-none"
                  />
                </div>
              </div>

              <!-- Avg. Past Discount & Expected Future Discount Sliders -->
              <div class="grid grid-cols-2 gap-4" transition:fade={{ duration: 250 }}>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <label for="past-discount" class="font-label-sm text-on-surface-variant text-xs font-semibold">Avg. Past Discount</label>
                    <span class="font-data-mono text-primary font-bold text-xs">{Math.round(avgDiscountPercent)}%</span>
                  </div>
                  <input
                    id="past-discount"
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    bind:value={avgDiscountPercent}
                    class="w-full h-1 mt-2.5"
                  />
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <label for="future-discount" class="font-label-sm text-on-surface-variant text-xs font-semibold flex items-center">
                      {t.expFutureDiscount}
                      <Tooltip id="discount" language={language} mlText={translations.ml.discountTooltip} text={translations.en.discountTooltip} link="/#discount" />
                    </label>
                    <span class="font-data-mono text-primary font-bold text-xs">{Math.round(futureDiscountPercent)}%</span>
                  </div>
                  <input
                    id="future-discount"
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    bind:value={futureDiscountPercent}
                    class="w-full h-1 mt-2.5"
                  />
                </div>
              </div>

              <!-- Claim Bid Month Slider -->
              <div class="space-y-2" transition:fade={{ duration: 250 }}>
                <div class="flex justify-between">
                  <label for="claim-month" class="font-label-sm text-on-surface-variant text-xs font-semibold flex items-center">
                    {t.expBidClaimMonth}
                    <Tooltip id="bidder" language={language} mlText="ലേലത്തിൽ പങ്കെടുത്തു ചിട്ടി തുക കൈപ്പറ്റാൻ ഉദ്ദേശിക്കുന്ന മാസം." text="The month in which you plan to bid and claim the prize money." link="/#bidder" />
                  </label>
                  <span class="font-data-mono text-primary font-bold text-xs">{language === 'ml' ? 'മാസം' : 'Month'} {claimMonth}</span>
                </div>
                <input
                  id="claim-month"
                  type="range"
                  min={currentMonth + 1}
                  max={chitMonths}
                  step="1"
                  bind:value={claimMonth}
                  class="w-full h-1"
                />
                <div class="flex justify-between text-[9px] text-outline font-bold">
                  <span>{language === 'ml' ? 'മാസം' : 'Month'} {currentMonth + 1} ({language === 'ml' ? 'ഏറ്റവും അടുത്തത്' : 'Soonest'})</span>
                  <span>{language === 'ml' ? 'മാസം' : 'Month'} {chitMonths} ({language === 'ml' ? 'അവസാനം' : 'End'})</span>
                </div>
              </div>
            {:else}
              <!-- ==================== EMI PARAMS ==================== -->
              <!-- Loan Amount -->
              <div class="space-y-3" transition:fade={{ duration: 250 }}>
                <div class="flex justify-between items-center">
                  <label for="amount-input" class="font-label-sm text-on-surface-variant text-sm font-medium">{t.principalAmount}</label>
                  <span class="font-data-mono text-primary text-lg font-bold">{formatCurrency(amount)}</span>
                </div>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <input
                      id="amount-input"
                      type="number"
                      bind:value={amount}
                      min="10000"
                      max="100000000"
                      step="10000"
                      class="w-full bg-outline-variant/10 dark:bg-white/5 border border-outline-variant/40 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                    />
                  </div>
                </div>
                <!-- Quick Amount Pills -->
                <div class="flex flex-wrap gap-2 pt-1">
                  {#each config.options as opt}
                    <button
                      type="button"
                      class="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase border transition-all cursor-pointer {amount === opt ? 'bg-primary/20 border-primary text-primary' : 'bg-transparent border-outline-variant/30 text-on-surface-variant hover:border-primary/50'}"
                      onclick={() => amount = opt}
                    >
                      {formatCurrency(opt)}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- Interest Rate -->
              <div class="space-y-3" transition:fade={{ duration: 250 }}>
                <div class="flex justify-between items-center">
                  <label for="rate-range" class="font-label-sm text-on-surface-variant text-sm font-medium">{language === 'ml' ? 'പലിശ നിരക്ക് (% p.a.)' : 'Interest Rate (% p.a.)'}</label>
                  <span class="font-data-mono text-primary text-lg font-bold">{rate}%</span>
                </div>
                <input
                  id="rate-range"
                  class="w-full h-1.5"
                  max="20"
                  min="1"
                  step="0.1"
                  type="range"
                  bind:value={rate}
                />
                <div class="flex justify-between text-[10px] text-outline uppercase tracking-wider font-bold">
                  <span>1%</span>
                  <span>10.5%</span>
                  <span>20%</span>
                </div>
              </div>

              <!-- Tenure -->
              <div class="space-y-3" transition:fade={{ duration: 250 }}>
                <div class="flex justify-between items-center">
                  <label for="tenure-range" class="font-label-sm text-on-surface-variant text-sm font-medium">{language === 'ml' ? 'വായ്പ കാലാവധി (വർഷം)' : 'Loan Tenure (Years)'}</label>
                  <span class="font-data-mono text-primary text-lg font-bold">{tenure} {language === 'ml' ? 'വർഷം' : 'Years'}</span>
                </div>
                <input
                  id="tenure-range"
                  class="w-full h-1.5"
                  max="30"
                  min="1"
                  step="1"
                  type="range"
                  bind:value={tenure}
                />
                <div class="flex justify-between text-[10px] text-outline uppercase tracking-wider font-bold">
                  <span>1 {language === 'ml' ? 'വർഷം' : 'Year'}</span>
                  <span>15 {language === 'ml' ? 'വർഷം' : 'Years'}</span>
                  <span>30 {language === 'ml' ? 'വർഷം' : 'Years'}</span>
                </div>
              </div>
            {/if}

            <div class="pt-2">
              <button
                class="w-full py-3.5 rounded-xl shiny-btn text-on-primary font-bold text-base hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer shadow-lg"
                onclick={() => triggerToast(calculatorMode === 'substitution' ? (language === 'ml' ? 'ചിട്ടി സബ്സ്റ്റിറ്റ്യൂഷൻ വിശകലനം പൂർത്തിയായി!' : "Chitty Substitution analysis compiled!") : (language === 'ml' ? 'ഇ.എം.ഐ കണക്കുകൾ പുതുക്കി!' : "EMI calculations refreshed!"))}
              >
                {t.recalculate}
              </button>
            </div>
          </div>

          <!-- Quick Tip Card -->
          <div class="glass-card p-5 rounded-2xl flex items-center gap-4 bg-primary/5 border border-primary/20 hover:border-primary/40 duration-300">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/10 text-primary shrink-0">
              <span class="material-symbols-outlined text-lg">info</span>
            </div>
            <div>
              <p class="font-bold text-primary text-sm">
                {#if calculatorMode === 'substitution'}
                  {t.tipTitleSub}
                {:else}
                  {t.tipTitleEmi}
                {/if}
              </p>
              <p class="text-xs text-on-surface-variant leading-relaxed mt-0.5 font-medium">
                {#if calculatorMode === 'substitution'}
                  {t.tipDescSub}
                {:else}
                  {t.tipDescEmi}
                {/if}
              </p>
            </div>
          </div>

          <!-- Chit Basics Link Card -->
          <a href="/" class="glass-card p-5 rounded-2xl flex items-center gap-4 bg-secondary/5 border border-secondary/20 hover:border-secondary/40 duration-300 hover:-translate-y-0.5 cursor-pointer decoration-none">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center bg-secondary/10 text-secondary shrink-0">
              <span class="material-symbols-outlined text-lg">menu_book</span>
            </div>
            <div class="flex-1">
              <p class="font-bold text-secondary text-sm">
                {language === 'ml' ? 'ചിട്ടി വിവരങ്ങൾ പഠിക്കാം' : 'Learn Chit Basics'}
              </p>
              <p class="text-xs text-on-surface-variant leading-relaxed mt-0.5 font-medium">
                {language === 'ml' ? 'ചിട്ടിയിലെ വിവിധ പദങ്ങളും പ്രവർത്തന രീതികളും ലളിതമായി മനസ്സിലാക്കൂ.' : 'Understand chit terms, auction rules, dividends, and safety checklists.'}
              </p>
            </div>
            <span class="material-symbols-outlined text-secondary text-lg">arrow_forward</span>
          </a>
        </div>

        <!-- Results Section (Right Dashboard) -->
        <div class="lg:col-span-6 space-y-6">
          <div class="glass-card p-8 lg:p-10 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <!-- Abstract background mesh glow -->
            <div class="absolute -top-24 -right-24 w-60 h-60 bg-primary/10 dark:bg-primary/5 blur-[90px] rounded-full"></div>

            <h3 class="text-on-surface-variant font-label-sm uppercase tracking-[0.2em] mb-3 text-xs font-bold text-center">
              {#if calculatorMode === 'substitution'}
                {t.compoundYield}
              {:else}
                {t.estimatedEmi}
              {/if}
            </h3>

            <div class="flex items-baseline gap-1.5 mb-6 justify-center">
              {#if calculatorMode === 'substitution'}
                <span class="font-headline-lg text-4xl lg:text-5xl text-primary font-bold tracking-tight chart-glow text-glow-green">
                  {$chitIrrTweened.toFixed(2)}%
                </span>
              {:else}
                <span class="text-on-surface-variant text-xl font-bold">₹</span>
                <span class="font-headline-lg text-4xl lg:text-5xl text-primary font-bold tracking-tight chart-glow text-glow-green">
                  {formatCurrency($emiTweened).replace("₹", "")}
                </span>
              {/if}
            </div>

            <!-- Double Grid Visualization -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center border-t border-outline-variant/30 dark:border-white/10 pt-6">
              
              <!-- Circular Donut Chart -->
              <div class="relative flex flex-col items-center justify-center">
                <svg class="w-40 h-40 transform -rotate-90 chart-glow">
                  <!-- Background circle -->
                  <circle
                    class="text-outline-variant/20 dark:text-white/5"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="64"
                    stroke="currentColor"
                    stroke-width="12"
                  ></circle>

                  <!-- Principal segment -->
                  <circle
                    class="text-primary transition-all duration-300"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="64"
                    stroke="currentColor"
                    stroke-width="12"
                    stroke-dasharray="{$principalPercentTweened * 4.021} 402.1"
                    stroke-dashoffset="0"
                    stroke-linecap="round"
                  ></circle>

                  <!-- Interest segment -->
                  <circle
                    class="text-secondary opacity-65 transition-all duration-300"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="64"
                    stroke="currentColor"
                    stroke-width="12"
                    stroke-dasharray="{$interestPercentTweened * 4.021} 402.1"
                    stroke-dashoffset="-{$principalPercentTweened * 4.021}"
                    stroke-linecap="round"
                  ></circle>
                </svg>

                <div class="absolute flex flex-col items-center">
                  <span class="text-[9px] text-outline font-bold uppercase tracking-widest">
                    {#if calculatorMode === 'substitution'}
                      {language === 'ml' ? 'അനുപാതം' : 'Margin'}
                    {:else}
                      {language === 'ml' ? 'അനുപാതം' : 'Ratio'}
                    {/if}
                  </span>
                  <span class="text-base font-data-mono font-bold text-on-surface mt-0.5">
                    {Math.round($principalPercentTweened)}:{Math.round($interestPercentTweened)}
                  </span>
                </div>
              </div>

              <!-- Legend Stats -->
              <div class="space-y-4 text-left">
                {#if calculatorMode === 'substitution'}
                  <!-- Chitty mode statistics -->
                  <!-- Monthly Installment -->
                  <div class="space-y-1.5 border-b border-outline-variant/10 dark:border-white/5 pb-2">
                    <div class="flex justify-between items-center text-xs">
                      <div class="flex items-center gap-1.5 font-bold text-on-surface-variant">
                        <div class="w-2 h-2 rounded-full bg-outline"></div>
                        <span>{t.monthlyInstallment}</span>
                        <Tooltip id="monthlyInstallment" language={language} mlText={translations.ml.monthlyInstallmentTooltip} text={translations.en.monthlyInstallmentTooltip} link="/#monthly-installment" />
                      </div>
                      <span class="font-data-mono font-bold text-on-surface">{formatCurrency(chitM)}</span>
                    </div>
                  </div>

                  <!-- Buy-in (Join Cost) -->
                  <div class="space-y-1.5 pt-1">
                    <div class="flex justify-between items-center text-xs">
                      <div class="flex items-center gap-1.5 font-bold text-on-surface-variant">
                        <div class="w-2 h-2 rounded-full bg-primary animate-ping" style="animation-duration: 3s"></div>
                        <span>{t.buyInJoinCost}</span>
                      </div>
                      <span class="font-data-mono font-bold text-on-surface">{formatCurrency($chitCostJoinTweened)}</span>
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center text-xs">
                      <div class="flex items-center gap-1.5 font-bold text-on-surface-variant">
                        <div class="w-2 h-2 rounded-full bg-tertiary"></div>
                        <span>{t.futureContributions}</span>
                      </div>
                      <span class="font-data-mono font-bold text-on-surface">{formatCurrency($chitCostFutureTweened)}</span>
                    </div>
                  </div>

                  <div class="space-y-1.5 border-t border-outline-variant/20 dark:border-white/5 pt-2">
                    <div class="flex justify-between items-center text-xs">
                      <div class="flex items-center gap-1.5 font-bold text-on-surface-variant">
                        <div class="w-2 h-2 rounded-full bg-secondary"></div>
                        <span>{t.expectedProfit}</span>
                        <Tooltip id="dividend" language={language} mlText={translations.ml.dividendTooltip} text={translations.en.dividendTooltip} link="/#dividend" />
                      </div>
                      <span class="font-data-mono font-bold text-secondary text-glow-green">{formatCurrency($chitNetProfitTweened)}</span>
                    </div>
                  </div>

                  <!-- Foreman Commission -->
                  <div class="space-y-1.5 border-t border-outline-variant/20 dark:border-white/5 pt-2">
                    <div class="flex justify-between items-center text-xs">
                      <div class="flex items-center gap-1.5 font-bold text-on-surface-variant">
                        <div class="w-2 h-2 rounded-full bg-error/70"></div>
                        <span>{language === 'ml' ? 'ഫോർമാൻ കമ്മീഷൻ (5%)' : 'Foreman Commission (5%)'}</span>
                        <Tooltip id="foremanCommission" language={language} mlText={translations.ml.foremanCommissionTooltip} text={translations.en.foremanCommissionTooltip} link="/#foreman-commission" />
                      </div>
                      <span class="font-data-mono font-bold text-error">{formatCurrency(chitValue * 0.05)}</span>
                    </div>
                  </div>

                  <div class="pt-3 border-t border-outline-variant/30 dark:border-white/10 flex justify-between items-center">
                    <span class="font-bold text-on-surface text-xs md:text-sm flex items-center">
                      {t.netPrizePayout}
                      <Tooltip id="prizeMoney" language={language} mlText={translations.ml.prizeMoneyTooltip} text={translations.en.prizeMoneyTooltip} link="/#prize-money" />
                    </span>
                    <span class="text-primary font-bold text-lg text-glow-green">{formatCurrency($chitPrizeMoneyTweened)}</span>
                  </div>
                {:else}
                  <!-- EMI mode statistics -->
                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center text-xs">
                      <div class="flex items-center gap-1.5 font-bold text-on-surface-variant">
                        <div class="w-2 h-2 rounded-full bg-primary"></div>
                        <span>{t.principalAmount}</span>
                      </div>
                      <span class="font-data-mono font-bold text-on-surface">{formatCurrency(amount)}</span>
                    </div>
                    <div class="w-full bg-outline-variant/20 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-primary h-full transition-all duration-500" style="width: {$principalPercentTweened}%"></div>
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center text-xs">
                      <div class="flex items-center gap-1.5 font-bold text-on-surface-variant">
                        <div class="w-2 h-2 rounded-full bg-secondary"></div>
                        <span>{t.totalInterest}</span>
                      </div>
                      <span class="font-data-mono font-bold text-on-surface">{formatCurrency($totalInterestTweened)}</span>
                    </div>
                    <div class="w-full bg-outline-variant/20 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-secondary h-full opacity-70 transition-all duration-500" style="width: {$interestPercentTweened}%"></div>
                    </div>
                  </div>

                  <div class="pt-3 border-t border-outline-variant/30 dark:border-white/10 flex justify-between items-center">
                    <span class="font-bold text-on-surface text-sm">{t.totalRepayment}</span>
                    <span class="text-primary font-bold text-lg text-glow-green">{formatCurrency($totalPaymentTweened)}</span>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Graph Display Card -->
            <div class="w-full bg-outline-variant/10 dark:bg-black/10 rounded-2xl p-4 border border-outline-variant/30 dark:border-white/5 mt-6 shadow-inner relative overflow-hidden">
              <h4 class="text-[10px] text-outline font-bold uppercase tracking-wider mb-2">
                {#if calculatorMode === 'substitution'}
                  {t.cashFlowMilestone}
                {:else}
                  {t.outstandingPrincipal}
                {/if}
              </h4>
              
              {#if calculatorMode === 'substitution'}
                <svg viewBox="0 0 420 130" class="w-full h-24 overflow-visible">
                  <defs>
                    <linearGradient id="chitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  <!-- Zero line (Break even) -->
                  <line x1="15" y1={chittyChartPath.zeroY} x2="405" y2={chittyChartPath.zeroY} stroke="var(--color-outline-variant)" stroke-opacity="0.35" stroke-dasharray="4,4" />
                  <text x="20" y={chittyChartPath.zeroY - 4} fill="var(--color-outline)" font-size="8" font-weight="bold">{t.breakEven}</text>

                  <path d={chittyChartPath.areaPath} fill="url(#chitAreaGrad)" />
                  <path d={chittyChartPath.linePath} fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" class="chart-glow" />
                  
                  <!-- Bidding Claim point Highlight -->
                  {#if chittyChartPath.points.length > 0}
                    <!-- Join Point -->
                    <circle cx={chittyChartPath.points[0].x} cy={chittyChartPath.points[0].y} r="3.5" fill="var(--color-error)" />
                    
                    <!-- Prize Point -->
                    {@const prizePt = chittyChartPath.points[claimMonth - currentMonth]}
                    {#if prizePt}
                      <circle cx={prizePt.x} cy={prizePt.y} r="5" fill="var(--color-primary)" />
                      <line x1={prizePt.x} y1={prizePt.y} x2={prizePt.x} y2="115" stroke="var(--color-primary)" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="2,2" />
                    {/if}
                  {/if}
                </svg>
              {:else}
                <svg viewBox="0 0 420 130" class="w-full h-24 overflow-visible">
                  <defs>
                    <linearGradient id="emiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <!-- Horizontal/Vertical Grid Lines -->
                  <line x1="15" y1="15" x2="405" y2="15" stroke="var(--color-outline-variant)" stroke-opacity="0.1" stroke-dasharray="3,3" />
                  <line x1="15" y1="65" x2="405" y2="65" stroke="var(--color-outline-variant)" stroke-opacity="0.1" stroke-dasharray="3,3" />
                  <line x1="15" y1="115" x2="405" y2="115" stroke="var(--color-outline-variant)" stroke-opacity="0.2" />
                  
                  <path d={emiChartPath.areaPath} fill="url(#emiAreaGrad)" />
                  <path d={emiChartPath.linePath} fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" class="chart-glow" />
                  
                  {#if emiChartPath.points.length > 0}
                    <circle cx={emiChartPath.points[0].x} cy={emiChartPath.points[0].y} r="3.5" fill="var(--color-primary)" />
                    <circle cx={emiChartPath.points[emiChartPath.points.length - 1].x} cy={emiChartPath.points[emiChartPath.points.length - 1].y} r="3.5" fill="var(--color-primary)" />
                  {/if}
                </svg>
              {/if}
            </div>

            <div class="mt-6 w-full">
              <button
                class="w-full py-3.5 border border-primary/30 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-primary font-bold cursor-pointer text-sm shadow-md active:scale-[0.99]"
                onclick={() => triggerToast(language === 'ml' ? "അംഗത്വ യോഗ്യതാ പോർട്ടലിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു..." : "Redirecting to subscriber eligibility portal...")}
              >
                <span class="material-symbols-outlined text-base">bolt</span>
                {t.requestEnrolment}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Amortization / Cash Flow Breakdown Section (Always shown for both modes!) -->
      {#if calculatorMode === 'emi' || calculatorMode === 'substitution'}
      <section class="space-y-5">
        <div class="flex justify-between items-end flex-wrap gap-4 border-b border-outline-variant/30 pb-3">
          <div>
            <h2 class="font-headline-md text-on-surface text-xl font-bold tracking-tight flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">payments</span>
              {#if calculatorMode === 'substitution'}
                {t.cashFlowMilestone}
              {:else}
                {language === 'ml' ? 'റീപേമെന്റ് ചാർട്ട്' : 'Amortization Schedule'}
              {/if}
            </h2>
            <p class="text-on-surface-variant text-xs mt-0.5 leading-relaxed font-semibold">
              {#if calculatorMode === 'substitution'}
                {language === 'ml' ? 'പ്രതിമാസ പണമിടപാടുകൾ. ലേലം വിളിച്ചതിന് ശേഷമുള്ള ലാഭം പച്ച നിറത്തിൽ കാണിച്ചിരിക്കുന്നു.' : 'Month-by-month cash balances. Green indicates positive gains post prize claim.'}
              {:else}
                {language === 'ml' ? 'വർഷം തിരിച്ചുള്ള അടവ് വിവരങ്ങൾ. ഓരോ മാസത്തെയും വിവരങ്ങൾ കാണാൻ വർഷത്തിൽ ക്ലിക്ക് ചെയ്യുക.' : 'Year-by-year payment schedule. Click any year row to view individual monthly details.'}
              {/if}
            </p>
          </div>

          <div class="flex items-center gap-4 w-full md:w-auto">
            <!-- Search bar -->
            <div class="flex items-center bg-outline-variant/15 dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 rounded-xl px-3 py-1.5 gap-2 w-full md:w-56">
              <span class="material-symbols-outlined text-outline text-base">search</span>
              <input
                class="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-on-surface placeholder:text-outline-variant w-full p-0"
                placeholder={t.searchSchedule}
                type="text"
                bind:value={searchTerm}
              />
            </div>
            
            <button
              class="flex items-center gap-1.5 px-3 py-2 bg-outline-variant/15 dark:bg-white/5 rounded-xl border border-outline-variant/30 dark:border-white/10 hover:bg-outline-variant/25 dark:hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer shrink-0"
              onclick={() => triggerToast(language === 'ml' ? 'റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുന്നു...' : 'Detailed amortization schedule exported successfully!')}
            >
              <span class="material-symbols-outlined text-xs">download</span>
              {t.downloadPdf}
            </button>
          </div>
        </div>

        <div class="glass-card rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 dark:border-white/10">
          <div class="overflow-x-auto max-h-[460px]">
            <table class="w-full text-left border-collapse">
              <thead class="sticky top-0 bg-outline-variant/80 dark:bg-[#12191b]/90 backdrop-blur-md z-20">
                <tr class="text-on-surface-variant text-[10px] uppercase tracking-wider font-bold border-b border-outline-variant/30 dark:border-white/10">
                  {#if calculatorMode === 'substitution'}
                    <th class="px-6 py-4">{t.monthIndex}</th>
                    <th class="px-6 py-4">{t.transactionMilestone}</th>
                    <th class="px-6 py-4">{t.cashFlow}</th>
                    <th class="px-6 py-4">{t.cumulativePosition}</th>
                    <th class="px-6 py-4">{t.details}</th>
                  {:else}
                    <th class="px-6 py-4">{t.year}</th>
                    <th class="px-6 py-4">{t.openingBalance}</th>
                    <th class="px-6 py-4">{t.interestPaid}</th>
                    <th class="px-6 py-4">{t.principalPaid}</th>
                    <th class="px-6 py-4 text-primary">{t.closingBalance}</th>
                  {/if}
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/10 dark:divide-white/5 font-data-mono text-xs">
                {#if calculatorMode === 'substitution'}
                  {#each paginatedChitRows as row}
                    <tr 
                      class="hover:bg-outline-variant/10 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      onclick={() => toggleRow(`chit-${row.monthText}`)}
                    >
                      <td class="px-6 py-4 font-bold text-on-surface flex items-center gap-1">
                        <span class="material-symbols-outlined text-secondary text-sm transition-transform duration-200 {expandedRows[`chit-${row.monthText}`] ? 'rotate-90' : ''}">chevron_right</span>
                        {row.monthText.replace("Month", language === 'ml' ? 'മാസം' : 'Month')}
                      </td>
                      <td class="px-6 py-4 font-bold text-on-surface">{row.description}</td>
                      <td class="px-6 py-4 font-bold {row.amount >= 0 ? 'text-primary text-glow-green' : 'text-error'}">
                        {row.amount >= 0 ? '+' : ''}{formatCurrency(row.amount)}
                      </td>
                      <td class="px-6 py-4 font-bold {row.cumulative >= 0 ? 'text-primary' : 'text-on-surface-variant'}">
                        {formatCurrency(row.cumulative)}
                      </td>
                      <td class="px-6 py-4 text-on-surface-variant text-[11px] max-w-xs truncate">{row.details}</td>
                    </tr>
                    {#if expandedRows[`chit-${row.monthText}`]}
                      <tr transition:slide={{ duration: 200 }}>
                        <td colspan="5" class="bg-outline-variant/5 dark:bg-black/25 p-4 border-l-2 border-secondary">
                          <div class="text-[10px] text-outline font-bold uppercase tracking-wider mb-1">{language === 'ml' ? 'ഇടപാട് വിവരങ്ങൾ' : 'Transaction Details'}</div>
                          <p class="text-on-surface-variant leading-relaxed text-xs font-semibold">{row.details}</p>
                          <div class="mt-2 text-[10px] text-on-surface-variant flex gap-4 font-bold">
                            <span>{language === 'ml' ? 'തരം: ' : 'Type: '} <strong class="uppercase text-secondary">{row.type}</strong></span>
                            <span>{language === 'ml' ? 'ബാക്കി തുക: ' : 'Rolling Position: '} <strong>{formatCurrency(row.cumulative)}</strong></span>
                          </div>
                        </td>
                      </tr>
                    {/if}
                  {:else}
                    <tr class="text-on-surface-variant"><td colspan="5" class="text-center py-6 text-outline">{language === 'ml' ? 'തിരച്ചിലിൽ വിവരങ്ങൾ ഒന്നും ലഭിച്ചില്ല.' : 'No schedule items found matching search filters.'}</td></tr>
                  {/each}
                {:else}
                  {#each paginatedEmiRows as row}
                    <tr 
                      class="hover:bg-outline-variant/10 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      onclick={() => toggleRow(`year-${row.year}`)}
                    >
                      <td class="px-6 py-4 font-bold text-on-surface flex items-center gap-1">
                        <span class="material-symbols-outlined text-primary text-sm transition-transform duration-200 {expandedRows[`year-${row.year}`] ? 'rotate-90' : ''}">chevron_right</span>
                        {language === 'ml' ? 'വർഷം' : 'Year'} {row.year}
                      </td>
                      <td class="px-6 py-4 text-on-surface-variant">{formatCurrency(row.openingBalance)}</td>
                      <td class="px-6 py-4 text-error font-semibold">{formatCurrency(row.interestPaid)}</td>
                      <td class="px-6 py-4 text-primary font-semibold">{formatCurrency(row.principalPaid)}</td>
                      <td class="px-6 py-4 text-on-surface font-semibold">{formatCurrency(row.closingBalance)}</td>
                    </tr>
                    {#if expandedRows[`year-${row.year}`]}
                      <tr transition:slide={{ duration: 250 }}>
                        <td colspan="5" class="bg-outline-variant/5 dark:bg-black/25 p-0">
                          <div class="px-8 py-3 space-y-2 border-l-2 border-primary">
                            <div class="text-[10px] text-outline font-bold uppercase tracking-wider mb-2">{t.monthlyBreakdown} ({language === 'ml' ? 'വർഷം' : 'Year'} {row.year})</div>
                            <div class="grid grid-cols-5 text-[10px] text-on-surface-variant font-bold pb-1 border-b border-outline-variant/20 dark:border-white/5">
                              <span>{t.month}</span>
                              <span>{t.openingBalance}</span>
                              <span>{language === 'ml' ? 'പലിശ ഭാഗം' : 'Interest Portion'}</span>
                              <span>{language === 'ml' ? 'അസ്സൽ ഭാഗം' : 'Principal Portion'}</span>
                              <span>{t.closingBalance}</span>
                            </div>
                            {#each row.months as m}
                              <div class="grid grid-cols-5 text-[11px] text-on-surface-variant py-1 border-b border-outline-variant/5 dark:border-white/5 last:border-b-0 font-medium">
                                <span class="font-bold text-on-surface">{language === 'ml' ? 'മാസം' : 'Month'} {m.month}</span>
                                <span>{formatCurrency(m.openingBalance)}</span>
                                <span class="text-error">{formatCurrency(m.interestPaid)}</span>
                                <span class="text-primary">{formatCurrency(m.principalPaid)}</span>
                                <span class="font-bold text-on-surface">{formatCurrency(m.closingBalance)}</span>
                              </div>
                            {/each}
                          </div>
                        </td>
                      </tr>
                    {/if}
                  {:else}
                    <tr class="text-on-surface-variant"><td colspan="5" class="text-center py-6 text-outline">{language === 'ml' ? 'തിരച്ചിലിൽ വിവരങ്ങൾ ഒന്നും ലഭിച്ചില്ല.' : 'No schedule items found matching search filters.'}</td></tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          {#if totalPages > 1}
            <div class="px-6 py-3.5 bg-outline-variant/20 dark:bg-black/20 border-t border-outline-variant/30 dark:border-white/10 flex justify-between items-center">
              <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wide">
                {language === 'ml' ? 'പേജ്' : 'Page'} {currentPage} {language === 'ml' ? 'ആകെ' : 'of'} {totalPages}
              </span>
              <div class="flex gap-2">
                <button
                  class="px-3 py-1.5 rounded-lg bg-outline-variant/15 dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-bold hover:bg-outline-variant/25 dark:hover:bg-white/10 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-on-surface"
                  disabled={currentPage === 1}
                  onclick={() => currentPage -= 1}
                >
                  {t.previous}
                </button>
                <button
                  class="px-3 py-1.5 rounded-lg bg-outline-variant/15 dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-xs font-bold hover:bg-outline-variant/25 dark:hover:bg-white/10 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-on-surface"
                  disabled={currentPage === totalPages}
                  onclick={() => currentPage += 1}
                >
                  {t.next}
                </button>
              </div>
            </div>
          {/if}
        </div>
      </section>
      {/if}
    </div>

    <!-- Educational Disclaimer Section -->
    <div class="max-w-7xl mx-auto w-full px-6 lg:px-10 pb-8 text-center">
      <div class="p-5 rounded-2xl bg-outline-variant/5 dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 text-xs text-on-surface-variant leading-relaxed max-w-4xl mx-auto font-medium">
        <span class="font-bold text-primary block mb-1">
          {language === 'ml' ? 'ഡിസ്‌ക്ലൈമർ / മുന്നറിയിപ്പ്' : 'Disclaimer'}
        </span>
        {language === 'ml' 
          ? 'ഈ ആപ്ലിക്കേഷൻ വിദ്യാഭ്യാസപരവും വിവരശേഖരണപരവുമായ ആവശ്യങ്ങൾക്ക് മാത്രമുള്ളതാണ്. യഥാർത്ഥ ചിട്ടി വ്യവസ്ഥകൾ, ലേല നിയമങ്ങൾ, ചാർജുകൾ, ഡിവിഡന്റുകൾ, ജാമ്യ വ്യവസ്ഥകൾ എന്നിവ ഓരോ ചിട്ടി കരാറുകൾക്കും ബാധകമായ നിയമങ്ങൾക്കും അനുസരിച്ച് വ്യത്യാസപ്പെടാം.'
          : 'This application is for educational and informational purposes only. Actual chit terms, auction rules, charges, dividends, security requirements and other conditions may vary according to the specific chit agreement and applicable laws/regulations.'}
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-auto py-8 border-t border-outline-variant/20 dark:border-white/5 text-center text-outline-variant text-[11px] font-medium leading-relaxed bg-background/20 backdrop-blur-sm relative z-10">
      <p>© 2026 {language === 'ml' ? 'സബ്സ്റ്റിറ്റ്യൂഷൻ ചിട്ടി & ലോൺ കാൽക്കുലേറ്റർ ഡാഷ്‌ബോർഡ്' : 'Substitution Chitty & Loan Calculator Dashboard'}.</p>
      <p class="mt-1 opacity-70">{language === 'ml' ? 'Svelte 5-ലും പ്രീമിയം ഗ്ലാസ്മോർഫിസം രൂപകൽപ്പനയിലും നിർമ്മിച്ചത്' : 'Powered by Svelte 5 and Premium Glassmorphism shift aesthetics'}.</p>
    </footer>
  </main>
</div>
