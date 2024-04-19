/*
  Warnings:

  - A unique constraint covering the columns `[link,email]` on the table `Email` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Email_id_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Email_link_email_key" ON "Email"("link", "email");
