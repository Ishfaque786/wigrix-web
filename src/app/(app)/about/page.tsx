import type { Metadata } from 'next'
import Link from 'next/link'
import { Smile, Heart, Zap, Sparkles, User, Star, ArrowRight, Shield, Leaf } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Wigrix | Our Story',
  description:
    'Learn about Wigrix and our passion for creating beautiful artisan lamps and home decor.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-36 bg-ikstudio-cream overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-wigrix-teal/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-wigrix-green/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-honeycomb-cream/20 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-honeycomb-charcoal text-white text-xs font-bold mb-6 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-wigrix-teal" />
            Our Story
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-honeycomb-charcoal tracking-tight mb-8">
            Crafted with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wigrix-teal to-wigrix-green">
              passion.
            </span>
          </h1>
          <p className="text-xl text-honeycomb-medium leading-relaxed font-medium max-w-2xl mx-auto">
            Wigrix was born from a love for beautiful lighting and thoughtful design. We believe
            your home should reflect warmth, character, and artisan craftsmanship.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-honeycomb-charcoal text-white font-bold text-base hover:bg-honeycomb-slate transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-honeycomb-charcoal text-honeycomb-charcoal font-bold text-base hover:bg-honeycomb-charcoal hover:text-white transition-all"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wigrix-teal/10 text-wigrix-teal text-xs font-bold mb-5 uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" />
                Our Mission
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-honeycomb-charcoal tracking-tight mb-6">
                Light up your world.
              </h2>
              <p className="text-lg text-honeycomb-medium mb-6 leading-relaxed">
                At Wigrix, we believe lighting is more than just function — it's an expression of
                style. Our artisan lamps and table decor are designed to transform any space into a
                warm, inviting sanctuary.
              </p>
              <p className="text-lg text-honeycomb-medium mb-8 leading-relaxed">
                Each piece is thoughtfully crafted with attention to detail, using quality materials
                that stand the test of time. From elegant table lamps to stunning decorative
                accents, we bring artisan craftsmanship to your home.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ikstudio-cream p-6 rounded-2xl border border-honeycomb-cream/30">
                  <Smile className="w-8 h-8 text-wigrix-teal mb-3" />
                  <h3 className="font-bold text-honeycomb-charcoal mb-1">Quality First</h3>
                  <p className="text-sm text-honeycomb-medium">
                    Premium materials and artisan craftsmanship.
                  </p>
                </div>
                <div className="bg-honeycomb-light p-6 rounded-2xl border border-honeycomb-cream/30">
                  <Heart className="w-8 h-8 text-wigrix-teal mb-3" />
                  <h3 className="font-bold text-honeycomb-charcoal mb-1">Thoughtful Design</h3>
                  <p className="text-sm text-honeycomb-medium">
                    Every detail considered for your space.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-ikstudio-cream to-honeycomb-light border-4 border-honeycomb-cream/30 shadow-2xl flex items-center justify-center relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-wigrix-teal/5 to-wigrix-green/5" />
                <div className="text-[140px] select-none">💡</div>

                {/* Floating badges */}
                <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-lg rotate-6 border border-honeycomb-cream/30">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="absolute bottom-10 left-10 bg-white p-4 rounded-2xl shadow-lg -rotate-6 border border-honeycomb-cream/30">
                  <span className="text-2xl">🏺</span>
                </div>
                <div className="absolute top-1/2 left-8 -translate-y-1/2 bg-wigrix-teal text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  Handcrafted
                </div>
              </div>

              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-[3.5rem] border-2 border-dashed border-wigrix-teal/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-12 bg-honeycomb-light border-y border-honeycomb-cream/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Products' },
              { value: '10k+', label: 'Happy Customers' },
              { value: '5★', label: 'Avg. Rating' },
              { value: '100%', label: 'Artisan Made' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl lg:text-4xl font-black text-honeycomb-charcoal">{stat.value}</p>
                <p className="text-sm text-honeycomb-medium font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-honeycomb-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wigrix-teal/20 text-wigrix-teal text-xs font-bold mb-5 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              What drives us
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">Our Values</h2>
            <p className="text-lg text-neutral-400 font-medium">
              What drives us to create beautiful lighting and decor for your home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Artisan Quality',
                desc: 'Each piece is crafted with care and meticulous attention to detail. We source only premium materials that last.',
                color: 'text-wigrix-teal',
                bg: 'bg-wigrix-teal/10',
              },
              {
                icon: Star,
                title: 'Timeless Design',
                desc: 'Classic aesthetics that complement any interior style, from modern minimalist to warm boho.',
                color: 'text-wigrix-green',
                bg: 'bg-wigrix-green/10',
              },
              {
                icon: Heart,
                title: 'Customer First',
                desc: 'Your satisfaction is our top priority. We stand behind every product we make with genuine care.',
                color: 'text-wigrix-teal',
                bg: 'bg-wigrix-teal/10',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="bg-neutral-800 rounded-3xl p-8 border border-neutral-700 hover:border-wigrix-teal/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-wigrix-teal/5"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Teal gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-wigrix-teal to-wigrix-green" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2256%22%20height%3D%22100%22%3E%3Cpath%20d%3D%22M28%2066L0%2050L0%2016L28%200L56%2016L56%2050L28%2066L28%20100%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff10%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] bg-[length:56px_100px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
            Ready to illuminate your space?
          </h2>
          <p className="text-xl text-white/90 mb-10 font-medium max-w-2xl mx-auto">
            Discover our collection of artisan lamps and table decor today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-honeycomb-charcoal font-bold text-base hover:bg-ikstudio-cream transition-all shadow-xl hover:-translate-y-0.5"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full border-2 border-white/40 text-white font-bold text-base hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
