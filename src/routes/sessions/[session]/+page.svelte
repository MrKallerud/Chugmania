<script lang="ts">
  import { enhance } from '$app/forms'
  import { Button } from '$lib/components/ui/button/index.js'
  import Lookup from '@/components/lookup/lookup.svelte'
  import type { PageData } from './$types'

  const { data }: { data: PageData } = $props()

  type Track = (typeof data.allTracks)[number]
  let selected = $state(undefined as Track | undefined)
</script>

<svelte:head>
  <title>{data.session.description ?? data.session.type}</title>
</svelte:head>

<div class="flex flex-col sm:gap-4 sm:py-4">
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <div class="flex justify-between">
      <h1>{data.session?.date?.toLocaleDateString()}</h1>
    </div>
    <form class="flex flex-row gap-2" use:enhance method="POST" action={`?/add`}>
      <Lookup placeholder="Velg en bane..." items={data.allTracks} entity="track" bind:selected />
      <Button size="sm" type="submit">Legg til</Button>
    </form>
    <Button>Registrer tid</Button>
    {#each data.tracks as track}
      <div>
        <h2>{track.name}</h2>
        {#each track.entries as entry}
          <div class="flex flex-row">
            <p>{entry.user.name}</p>
            <p>{entry.track.name}</p>
            <p>{entry.duration}</p>
          </div>
        {/each}
      </div>
    {/each}
  </main>
</div>
