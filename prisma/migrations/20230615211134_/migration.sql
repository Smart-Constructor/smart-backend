-- CreateTable
CREATE TABLE "Reports" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Units" (
    "id" SERIAL NOT NULL,
    "unitName" VARCHAR(255) NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "estimated" TIMESTAMP(3) NOT NULL,
    "concludedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
