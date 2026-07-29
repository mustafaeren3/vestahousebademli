import { Suspense } from "react";
import MenuApp from "@/components/menu/MenuApp";

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuApp />
    </Suspense>
  );
}
