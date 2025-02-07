import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: SliderPrimitive.SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex items-center select-none touch-none w-full h-4 bg-gray-300 rounded-full ",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="bg-gray relative flex-grow ">
        <SliderPrimitive.Range className=" rounded-full h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border border-gray rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray" />
      <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border border-gray rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray" />
    </SliderPrimitive.Root>
  );
}
