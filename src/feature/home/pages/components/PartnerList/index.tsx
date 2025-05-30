import React, { useEffect, useState } from "react";

import { PartnerListProps } from "./interface";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { PartnerType } from "@/feature/partner/pages/PartnerPage/interface";
import Image from "next/image";
import { cn } from "@/lib/util";

export function PartnerList({ className }: PartnerListProps) {
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const fetchPartner = async () => {
    const querySnapshot = await getDocs(collection(db, "partners"));
    const partnerData = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as PartnerType)
    );
    partnerData.sort((a, b) => a.order - b.order);
    setPartners(partnerData);
  };
  useEffect(() => {
    fetchPartner();
  }, []);

  return (
    partners.length > 0 && (
      <section
        className={cn(
          "max-w-[1024px] flex justify-center flex-wrap gap-[8px] mx-auto",
          className
        )}
      >
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="w-[56px] mobile-tablet:w-[42px] aspect-square relative"
          >
            <Image
              alt={partner.alt || "Partner Image"}
              src={partner.imageUrl}
              className="object-cover"
              fill
            />
          </div>
        ))}
      </section>
    )
  );
}
