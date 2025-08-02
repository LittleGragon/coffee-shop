import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredProducts = [
  {
    name: "Classic Cappuccino",
    price: "$3.50",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Chocolate Croissant",
    price: "$2.75",
    image: "https://images.unsplash.com/photo-1622399949624-5de74aa9553f?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Iced Latte",
    price: "$4.00",
    image: "https://images.unsplash.com/photo-1579989993649-595ae7b39863?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Red Velvet Cake",
    price: "$5.50",
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd3be?q=80&w=1974&auto=format&fit=crop",
  },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-12">
      <motion.section
        className="relative h-[500px] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2070&auto=format&fit=crop"
          alt="Cozy coffee shop interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center bg-black/50 text-center text-white">
          <motion.h1
            className="text-4xl font-bold md:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Daily Dose of Bliss
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover artisanal coffee, freshly baked pastries, and custom cakes
            made with love.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button className="mt-8 bg-sage-green text-coffee-brown hover:bg-sage-green/90">
              Order Now
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="container mx-auto px-4 md:px-6"
        initial={fadeIn.initial}
        whileInView={fadeIn.animate}
        transition={fadeIn.transition}
        viewport={{ once: true }}
      >
        <h2 className="mb-8 text-center text-3xl font-bold text-coffee-brown">
          Featured Products
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProducts.map((product, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-0 relative">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-4 rounded-b-lg">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p>{product.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </motion.section>

      <motion.section
        className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-6"
        initial={fadeIn.initial}
        whileInView={fadeIn.animate}
        transition={{ ...fadeIn.transition, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="rounded-lg bg-sage-green/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-coffee-brown">Design Your Dream Cake</h3>
          <p className="mt-2 text-coffee-brown/80">
            Create a custom cake for any occasion.
          </p>
          <Button className="mt-4 bg-sage-green text-coffee-brown hover:bg-sage-green/90">
            Design Your Cake
          </Button>
        </div>
        <div className="rounded-lg bg-sage-green/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-coffee-brown">Book a Table</h3>
          <p className="mt-2 text-coffee-brown/80">
            Reserve your spot for a cozy in-store experience.
          </p>
          <Button className="mt-4 bg-sage-green text-coffee-brown hover:bg-sage-green/90">
            Book a Table
          </Button>
        </div>
      </motion.section>
    </div>
  );
}