<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let { id, language, text, mlText, link } = $props();

  let isOpen = $state(false);

  function toggle(e) {
    e.stopPropagation();
    isOpen = !isOpen;
    window.dispatchEvent(new CustomEvent('close-tooltips', { detail: { id } }));
  }

  function handleClose(e) {
    if (e.type === 'close-tooltips' && e.detail.id !== id) {
      isOpen = false;
    } else if (e.type === 'click') {
      isOpen = false;
    }
  }

  onMount(() => {
    window.addEventListener('click', handleClose);
    window.addEventListener('close-tooltips', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('close-tooltips', handleClose);
    };
  });
</script>

<div class="relative inline-block ml-1.5 align-middle select-none">
  <button
    type="button"
    class="w-4.5 h-4.5 rounded-full bg-outline-variant/30 hover:bg-primary/20 dark:hover:bg-primary/30 border border-outline-variant/40 dark:border-white/10 text-[10px] inline-flex items-center justify-center font-bold text-on-surface-variant hover:text-primary transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
    onclick={toggle}
    aria-label="More information"
  >
    ?
  </button>
  {#if isOpen}
    <div
      transition:fade={{ duration: 120 }}
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3.5 bg-surface/98 dark:bg-[#12191b]/98 backdrop-blur-md rounded-2xl shadow-xl border border-primary/30 z-50 text-[11px] text-on-surface leading-relaxed font-body-md whitespace-normal normal-case text-left"
    >
      <p class="font-medium">{language === 'ml' ? mlText : text}</p>
      {#if link}
        <div class="mt-2.5 pt-2 border-t border-outline-variant/20 dark:border-white/10">
          <a
            href={link}
            class="text-primary font-bold inline-flex items-center gap-1 hover:underline text-[10px]"
            onclick={() => isOpen = false}
          >
            {language === 'ml' ? 'കൂടുതൽ വിവരങ്ങൾ' : 'Learn more'}
            <span class="material-symbols-outlined text-[10px]">arrow_forward</span>
          </a>
        </div>
      {/if}
    </div>
  {/if}
</div>
