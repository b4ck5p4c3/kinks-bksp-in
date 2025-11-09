-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_shortId_key" ON "Profile"("shortId");

-- CreateIndex
CREATE INDEX "Profile_shortId_idx" ON "Profile"("shortId");
