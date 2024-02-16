<script lang="ts">
  import { SvelteToast, toast } from "@zerodevx/svelte-toast";
  import Logo from "$lib/icons/Logo.svelte";
  import Search from "$lib/icons/Search.svelte";
  import Copy from "$lib/icons/Copy.svelte";
  import essences from "$lib/data/essences.json";
  import Fuse from "fuse.js";
  import { delayedInput } from "$lib/delayedInput";
  import type { SvelteToastOptions } from "@zerodevx/svelte-toast/stores";

  let searchString: string;
  let searchWithin: string;
  let shownEssences = essences;

  const descriptionRegex = /(drinking|drank|consuming|consumed|taste)/;

  const options: SvelteToastOptions = {
    duration: 2000,
    theme: {
      "--toastBackground": "rgb(24 24 27)",
      "--toastBarBackground": "rgb(63 63 70)",
    },
  };

  function search() {
    if (!searchString) {
      shownEssences = essences;
      return;
    }

    let searchKeys = [];
    if (searchWithin === "title") searchKeys = ["name"];
    else if (searchWithin === "description") searchKeys = ["description"];
    else searchKeys = ["name", "description"];
    const fuse = new Fuse(essences, {
      keys: searchKeys,
    });
    const result = fuse.search(searchString).map((i) => i.item);

    shownEssences = result;
  }

  function copyEssence(index: number) {
    const essence = shownEssences.filter((e) => e.index === index)[0];

    navigator.clipboard.writeText(
      `**${essence.name}**\n${
        descriptionRegex.test(essence.description[0].toLowerCase())
          ? `*${essence.description[0]}*`
          : essence.description[0]
      }\n${essence.description
        .filter((_, i) => i !== 0)
        .map((e) => `- ${e}`)
        .join("\n")}`,
    );

    toast.push(
      `<div class="flex"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-purple-400" style="transform: rotate(-12deg)"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>&nbsp;Copied!</div>`,
    );
  }
</script>

<SvelteToast {options} />

<div class="py-2 w-full space-x-2 flex justify-center items-center">
  <Logo class="w-12 h-12 -rotate-12 text-purple-400" />
  <h1 class="text-4xl font-bold select-none">Essence Viewer</h1>
</div>
<div
  class="w-12 h-12 fixed flex justify-center items-center right-2 bottom-2 rounded-full border border-white/10 bg-zinc-900 font-semibold select-none"
>
  {shownEssences.length}
</div>
<div class="py-2 px-4 flex">
  <div class="pl-2 py-1 bg-zinc-900 border border-r-0 border-white/10">
    <Search />
  </div>
  <input
    use:delayedInput={search}
    type="text"
    class="w-full bg-zinc-900 placeholder:text-gray-400 focus:outline-none border border-l-0 border-white/10 px-2 py-1"
    placeholder="Search..."
    bind:value={searchString}
  />
  <select
    bind:value={searchWithin}
    on:change={search}
    class="bg-zinc-900 focus:outline-none border-white/10 border border-l-0 px-1"
  >
    <option value="All">All</option>
    <option value="title">Title</option>
    <option value="description">Description</option>
  </select>
</div>

<div class="flex flex-wrap p-4 gap-4 justify-between overflow-x-hidden">
  {#each shownEssences as essence (essence.index)}
    <div class="min-w-[256px] max-w-[344px] border border-white/10 p-2">
      <div class="flex justify-between">
        <span class="font-bold text-purple-400">{essence.name}</span>
        <Copy
          class="cursor-pointer hover:text-gray-400 focus:outline-none"
          on:click={() => copyEssence(essence.index)}
        />
      </div>
      {#if descriptionRegex.test(essence.description[0].toLowerCase())}
        <i class="text-purple-200">{essence.description[0]}</i>
      {/if}
      <div class="border border-white/20 p-2">
        <ul class="list-disc pl-5 max-h-96 overflow-y-auto rounded pr-2 pb-2">
          {#each essence.description.filter((_, i) => !(i === 0 && descriptionRegex.test(essence.description[i].toLowerCase()))) as desc}
            <li class="text-purple-100 break-words">{desc}</li>
          {/each}
        </ul>
      </div>
    </div>
  {/each}
</div>
