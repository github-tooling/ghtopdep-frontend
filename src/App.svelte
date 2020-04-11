<script>
  import Tailwindcss from './Tailwindcss.svelte';
  import { onMount } from 'svelte';
  import { DataTable, List } from "smelte";
  import orderBy from 'lodash/orderBy';

  let data = [];
  let selected;
  let parsed = [];
  let episodes = [];
  const baseUrl = 'BASE_URL';

  onMount(async () => {
    const all = await fetch(`${baseUrl}/all`);
    parsed = await all.json();
  });

  async function showItem(item) {
    selected = item.text;
    const res = await fetch(`${baseUrl}/repos?url=${item.url}`);
		const result = await res.json();
		data = await orderBy(result.deps, 'stars', 'desc');
  }
</script>


<Tailwindcss />

<div class="flex m-5">
  <div class="w-1/4 mr-3">
    <h6 class="mb-3 mt-6">All repos</h6>
    <List bind:value={selected}  items={parsed}>
        <li slot="item" let:item={item}>
          <div
          class="cursor-pointer p-4 border-alert-50 border my-2 border-solid"
          on:click={() => showItem(item)}
          class:bg-alert-50={selected === item.text}
        >
          {item.text}
        </div>
        </li>
    </List>
  </div>
  <div class="p-1">
    <DataTable
      {data}
      columns={[
        { label: "Stars", field: "stars", class: "md:w-10", editable: false },
        {
          field: "url",
          class: "md:w-10",
          editable: false,
          value: v => `<a href="${v.url}" target="_blank">${new URL(v.url).pathname.replace("/", "") }</a>`,
        }
      ]}
    />
  </div>
</div>
