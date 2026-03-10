import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
};

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden pt-0">
      <Image
        src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
        alt={`${artwork.title}${artwork.author ? ` - ${artwork.author}` : ""}`}
        width={800}
        height={450}
        className="aspect-video w-full object-cover"
      />

      <CardHeader>
        <CardTitle>{artwork.title}</CardTitle>

        {artwork.author ? (
          <CardDescription>{artwork.author}</CardDescription>
        ) : null}

        <CardDescription>{artwork.description}</CardDescription>

        <Field>
          <FieldLabel htmlFor={`latitude-${artwork._id}`}>Latitude</FieldLabel>
          <Input
            id={`latitude-${artwork._id}`}
            disabled
            readOnly
            value={artwork.latitude?.toString() ?? ""}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`longitude-${artwork._id}`}>
            Longitude
          </FieldLabel>
          <Input
            id={`longitude-${artwork._id}`}
            disabled
            readOnly
            value={artwork.longitude?.toString() ?? ""}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`tags-${artwork._id}`}>Tags</FieldLabel>
          <Input
            id={`tags-${artwork._id}`}
            disabled
            readOnly
            value={artwork.tags?.join(", ") ?? ""}
          />
        </Field>
      </CardHeader>

      <CardFooter>
        <Button className="w-full">View details</Button>
      </CardFooter>
    </Card>
  );
}
