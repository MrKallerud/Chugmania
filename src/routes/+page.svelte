<script lang="ts">
  import Copy from 'lucide-svelte/icons/copy'
  import CreditCard from 'lucide-svelte/icons/credit-card'
  import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical'
  import Truck from 'lucide-svelte/icons/truck'

  import { Button } from '$lib/components/ui/button/index.js'
  import * as Card from '$lib/components/ui/card/index.js'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
  import { Separator } from '$lib/components/ui/separator/index.js'

  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
  const user = data.user
</script>

<div class="flex flex-col sm:gap-4 sm:py-4">
  <main
    class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
  >
    <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card.Root class="sm:col-span-2">
          <Card.Header class="pb-3">
            <Card.Title>Your Orders</Card.Title>
            <Card.Description class="max-w-lg text-balance leading-relaxed">
              Introducing Our Dynamic Orders Dashboard for Seamless Management and Insightful
              Analysis.
            </Card.Description>
          </Card.Header>
          <Card.Footer>
            <Button>Create New Order</Button>
          </Card.Footer>
        </Card.Root>
        <Card.Root>
          <Card.Header class="pb-2">
            <Card.Description>This Week</Card.Description>
            <Card.Title class="text-4xl">$1329</Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="text-xs text-muted-foreground">+25% from last week</div>
          </Card.Content>
        </Card.Root>
        <Card.Root>
          <Card.Header class="pb-2">
            <Card.Description>This Month</Card.Description>
            <Card.Title class="text-3xl">$5,329</Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="text-xs text-muted-foreground">+10% from last month</div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
    <div>
      <Card.Root class="overflow-hidden">
        <Card.Header class="flex flex-row items-start bg-muted/50">
          <div class="grid gap-0.5">
            <Card.Title class="group flex items-center gap-2 text-lg">
              Order Oe31b70H
              <Button
                size="icon"
                variant="outline"
                class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy class="h-3 w-3" />
                <span class="sr-only">Copy Order ID</span>
              </Button>
            </Card.Title>
            <Card.Description>Date: November 23, 2023</Card.Description>
          </div>
          <div class="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" class="h-8 gap-1">
              <Truck class="h-3.5 w-3.5" />
              <span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> Track Order </span>
            </Button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                <Button builders={[builder]} size="icon" variant="outline" class="h-8 w-8">
                  <EllipsisVertical class="h-3.5 w-3.5" />
                  <span class="sr-only">More</span>
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item>Export</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Trash</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </Card.Header>
        <Card.Content class="p-6 text-sm">
          <div class="grid gap-3">
            <div class="font-semibold">Order Details</div>
            <ul class="grid gap-3">
              <li class="flex items-center justify-between">
                <span class="text-muted-foreground">
                  Glimmer Lamps x <span>2</span>
                </span>
                <span>$250.00</span>
              </li>
              <li class="flex items-center justify-between">
                <span class="text-muted-foreground">
                  Aqua Filters x <span>1</span>
                </span>
                <span>$49.00</span>
              </li>
            </ul>
            <Separator class="my-2" />
            <ul class="grid gap-3">
              <li class="flex items-center justify-between">
                <span class="text-muted-foreground">Subtotal</span>
                <span>$299.00</span>
              </li>
              <li class="flex items-center justify-between">
                <span class="text-muted-foreground">Shipping</span>
                <span>$5.00</span>
              </li>
              <li class="flex items-center justify-between">
                <span class="text-muted-foreground">Tax</span>
                <span>$25.00</span>
              </li>
              <li class="flex items-center justify-between font-semibold">
                <span class="text-muted-foreground">Total</span>
                <span>$329.00</span>
              </li>
            </ul>
          </div>
          <Separator class="my-4" />
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-3">
              <div class="font-semibold">Shipping Information</div>
              <address class="grid gap-0.5 not-italic text-muted-foreground">
                <span>Liam Johnson</span>
                <span>1234 Main St.</span>
                <span>Anytown, CA 12345</span>
              </address>
            </div>
            <div class="grid auto-rows-max gap-3">
              <div class="font-semibold">Billing Information</div>
              <div class="text-muted-foreground">Same as shipping address</div>
            </div>
          </div>
          <Separator class="my-4" />
          <div class="grid gap-3">
            <div class="font-semibold">Customer Information</div>
            <dl class="grid gap-3">
              <div class="flex items-center justify-between">
                <dt class="text-muted-foreground">Customer</dt>
                <dd>Liam Johnson</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">liam@acme.com</a>
                </dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">+1 234 567 890</a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator class="my-4" />
          <div class="grid gap-3">
            <div class="font-semibold">Payment Information</div>
            <dl class="grid gap-3">
              <div class="flex items-center justify-between">
                <dt class="flex items-center gap-1 text-muted-foreground">
                  <CreditCard class="h-4 w-4" />
                  Visa
                </dt>
                <dd>**** **** **** 4532</dd>
              </div>
            </dl>
          </div>
        </Card.Content>
        <Card.Footer class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div class="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
        </Card.Footer>
      </Card.Root>
    </div>
  </main>
</div>
