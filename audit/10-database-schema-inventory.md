# ???? Prisma ????

- DATABASE_CONTENT_STATUS=UNVERIFIED
- ????????????????? Prisma ???????
- Seed ?????????: createMany, deleteMany, upsert
- ???: `prisma/seed.ts` ? `FAQ` ?? `deleteMany()`?
- Expand-and-contract ??: ????/??????????????????????????

## BrandSetting

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| siteName | String |  |
| brandNameCn | String |  |
| brandNameEn | String |  |
| companyName | String |  |
| slogan | String? |  |
| description | String? |  |
| productCenterDescription | String? |  |
| homepageHeroEyebrow | String? |  |
| homepageHeroTitle | String? |  |
| homepageHeroDescription | String? |  |
| phone | String? |  |
| email | String? |  |
| address | String? |  |
| wechat | String? |  |
| whatsapp | String? |  |
| logoUrl | String? |  |
| homepageHeroImageUrl | String? |  |
| faviconUrl | String? |  |
| defaultSeoTitle | String? |  |
| defaultSeoDesc | String? |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid())
- Relations: NONE

## ProductCategory

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| name | String |  |
| slug | String | @unique |
| title | String? |  |
| summary | String? |  |
| description | String? |  |
| coverImage | String? |  |
| sortOrder | Int | @default(0) |
| isPublished | Boolean | @default(true) |
| seoTitle | String? |  |
| seoDesc | String? |  |
| products | Product[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); slug: @unique
- Relations: NONE

## Product

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| categoryId | String |  |
| category | ProductCategory | @relation(fields: [categoryId], references: [id]) |
| name | String |  |
| model | String? |  |
| slug | String | @unique |
| shortDefinition | String? |  |
| summary | String? |  |
| description | String? |  |
| mainImage | String? |  |
| gallery | Json? |  |
| applicableCraft | String? |  |
| application | String? |  |
| functions | Json? |  |
| sellingPoints | Json? |  |
| specs | Json? |  |
| structure | String? |  |
| workingPrinciple | String? |  |
| operationSteps | Json? |  |
| suitableIndustries | Json? |  |
| unsuitableScenes | String? |  |
| standardConfig | Json? |  |
| optionalParts | Json? |  |
| maintenance | String? |  |
| troubleshooting | String? |  |
| aiSummary | String? |  |
| isFeatured | Boolean | @default(false) |
| isPublished | Boolean | @default(false) |
| sortOrder | Int | @default(0) |
| seoTitle | String? |  |
| seoDesc | String? |  |
| seoKeywords | String? |  |
| canonicalUrl | String? |  |
| faqs | FAQ[] |  |
| relatedArticles | Article[] |  |
| relatedCases | Case[] |  |
| downloads | Download[] |  |
| videos | Video[] |  |
| leads | Lead[] |  |
| solutions | Solution[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); slug: @unique
- Relations: category -> ProductCategory @relation(fields: [categoryId], references: [id])

## ArticleCategory

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| name | String |  |
| slug | String | @unique |
| description | String? |  |
| sortOrder | Int | @default(0) |
| isPublished | Boolean | @default(true) |
| articles | Article[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); slug: @unique
- Relations: NONE

## Article

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| categoryId | String |  |
| category | ArticleCategory | @relation(fields: [categoryId], references: [id]) |
| title | String |  |
| slug | String | @unique |
| excerpt | String? |  |
| coverImage | String? |  |
| content | String |  |
| conclusion | String? |  |
| articleType | String | @default("knowledge") |
| author | String? |  |
| reviewer | String? |  |
| aiSummary | String? |  |
| isPublished | Boolean | @default(false) |
| publishedAt | DateTime? |  |
| seoTitle | String? |  |
| seoDesc | String? |  |
| seoKeywords | String? |  |
| relatedProducts | Product[] |  |
| faqs | FAQ[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); slug: @unique
- Relations: category -> ArticleCategory @relation(fields: [categoryId], references: [id])

## FAQ

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| question | String |  |
| answer | String |  |
| category | String? |  |
| sortOrder | Int | @default(0) |
| isPublished | Boolean | @default(true) |
| products | Product[] |  |
| articles | Article[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid())
- Relations: NONE

## Solution

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| title | String |  |
| slug | String | @unique |
| industry | String? |  |
| scene | String? |  |
| painPoints | Json? |  |
| recommendedPlan | String? |  |
| processFlow | Json? |  |
| keyControls | Json? |  |
| equipmentList | Json? |  |
| advantages | Json? |  |
| content | String? |  |
| coverImage | String? |  |
| aiSummary | String? |  |
| isPublished | Boolean | @default(false) |
| seoTitle | String? |  |
| seoDesc | String? |  |
| relatedProducts | Product[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); slug: @unique
- Relations: NONE

## Case

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| title | String |  |
| slug | String | @unique |
| industry | String? |  |
| region | String? |  |
| customerName | String? |  |
| isAnonymous | Boolean | @default(true) |
| background | String? |  |
| problems | String? |  |
| workpiece | String? |  |
| craft | String? |  |
| equipmentConfig | String? |  |
| process | String? |  |
| result | String? |  |
| images | Json? |  |
| videoUrl | String? |  |
| content | String? |  |
| isPublished | Boolean | @default(false) |
| seoTitle | String? |  |
| seoDesc | String? |  |
| relatedProducts | Product[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); slug: @unique
- Relations: NONE

## Download

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| title | String |  |
| slug | String | @unique |
| fileUrl | String |  |
| fileType | String? |  |
| fileSize | String? |  |
| version | String? |  |
| summary | String? |  |
| catalogPreview | String? |  |
| requireLeadForm | Boolean | @default(false) |
| isPublished | Boolean | @default(false) |
| seoTitle | String? |  |
| seoDesc | String? |  |
| relatedProducts | Product[] |  |
| leads | Lead[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); slug: @unique
- Relations: NONE

## Video

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| title | String |  |
| slug | String | @unique |
| videoUrl | String |  |
| coverImage | String? |  |
| summary | String? |  |
| transcript | String? |  |
| steps | Json? |  |
| keyPoints | Json? |  |
| scene | String? |  |
| isPublished | Boolean | @default(false) |
| seoTitle | String? |  |
| seoDesc | String? |  |
| relatedProducts | Product[] |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); slug: @unique
- Relations: NONE

## Lead

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| name | String |  |
| company | String? |  |
| phone | String? |  |
| email | String? |  |
| wechat | String? |  |
| region | String? |  |
| sourcePage | String? |  |
| demandType | String? |  |
| interestedProduct | String? |  |
| workpiece | String? |  |
| currentIssue | String? |  |
| message | String? |  |
| attachmentUrl | String? |  |
| productId | String? |  |
| product | Product? | @relation(fields: [productId], references: [id]) |
| downloadId | String? |  |
| download | Download? | @relation(fields: [downloadId], references: [id]) |
| status | String | @default("new") |
| assignedTo | String? |  |
| remark | String? |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid())
- Relations: product -> Product? @relation(fields: [productId], references: [id]); download -> Download? @relation(fields: [downloadId], references: [id])

## MediaAsset

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| filename | String |  |
| url | String |  |
| mimeType | String? |  |
| size | Int? |  |
| alt | String? |  |
| title | String? |  |
| description | String? |  |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid())
- Relations: NONE

## AdminUser

| Field | Type | Attributes |
|---|---|---|
| id | String | @id @default(cuid()) |
| email | String | @unique |
| name | String? |  |
| passwordHash | String |  |
| role | String | @default("editor") |
| isActive | Boolean | @default(true) |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

- Unique/ID constraints: id: @id @default(cuid()); email: @unique
- Relations: NONE

## ???????

- `ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`
- `ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`
- `ALTER TABLE "Lead" ADD CONSTRAINT "Lead_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;`
- `ALTER TABLE "Lead" ADD CONSTRAINT "Lead_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "Download"("id") ON DELETE SET NULL ON UPDATE CASCADE;`
- `ALTER TABLE "_ProductToVideo" ADD CONSTRAINT "_ProductToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_ProductToVideo" ADD CONSTRAINT "_ProductToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_ProductToSolution" ADD CONSTRAINT "_ProductToSolution_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_ProductToSolution" ADD CONSTRAINT "_ProductToSolution_B_fkey" FOREIGN KEY ("B") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_ArticleToProduct" ADD CONSTRAINT "_ArticleToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_ArticleToProduct" ADD CONSTRAINT "_ArticleToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_ArticleToFAQ" ADD CONSTRAINT "_ArticleToFAQ_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_ArticleToFAQ" ADD CONSTRAINT "_ArticleToFAQ_B_fkey" FOREIGN KEY ("B") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_FAQToProduct" ADD CONSTRAINT "_FAQToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_FAQToProduct" ADD CONSTRAINT "_FAQToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_CaseToProduct" ADD CONSTRAINT "_CaseToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_CaseToProduct" ADD CONSTRAINT "_CaseToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_DownloadToProduct" ADD CONSTRAINT "_DownloadToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Download"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
- `ALTER TABLE "_DownloadToProduct" ADD CONSTRAINT "_DownloadToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
