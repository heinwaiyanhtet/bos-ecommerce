import CategoryComponent from "@/components/ecom/Category";
import { Backend_URL } from "@/lib/fetch";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Params {
  params: { slug: string[] };
}

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const { slug } = params;

  // Fetch product data from your backend
  const category = await fetch(
    `${Backend_URL}/ecommerce-categories/${slug[2]}`
  ).then((res) => res.json());

  if (!category) {
    notFound();
  }

  return {
    title: `Boss Nation | ${category?.name}`,
    keywords: [category.description, `Boss Nation ${slug[0]}`],
    openGraph: {
      title: `Boss Nation | ${category?.name}`,
      url: `https://bossnnationmyanmar/categories/${slug[2]}`,
      images: [
        {
          url: category.media?.url || "",
          width: 1920,
          height: 1080,
          alt: "Boss Nation",
        },
      ],
    },
  };
}

const CategoryPage = ({ params }: { params: any }) => {
  const { slug } = params;

  console.log(slug);

  return (
    <CategoryComponent
      id={slug[1]}
      param={slug[0]}
      url={`/${slug[0]}/${slug[1]}/${slug[2]}`}
      slug={slug}
    />
  );
};

export default CategoryPage;
