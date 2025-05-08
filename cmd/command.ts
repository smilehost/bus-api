import "dotenv/config";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "../internal/repository/authRespository";
import { AuthService } from "../internal/service/authService";

const prisma = new PrismaClient();

yargs(hideBin(process.argv))
  .command(
    "create-admin",
    "Create a new admin user",
    {
      comid: {
        type: "number",
        demandOption: true,
        describe: "Company ID of the admin",
      },
      username: {
        type: "string",
        demandOption: true,
        describe: "Username for the admin",
      },
      name: {
        type: "string",
        demandOption: true,
        describe: "Name for the admin",
      },
    },
    async (argv) => {
      const repo = new AuthRepository(prisma);
      const service = new AuthService(repo);

      try {
        
        const { password, admin } = await service.createAdmin(
          argv.comid,
          argv.name,
          argv.username
        );
        console.log("-------Admin created-------");
        console.log("Name: ", admin.account_name);
        console.log("Username: ", admin.account_username);
        console.log("Password: ", password);
        console.log("Company ID: ", admin.account_com_id);
        console.log("-------Admin created-------");
      } catch (error) {
        console.error("Failed to create admin:", error);
      } finally {
        await prisma.$disconnect();
      }
    }
  )
  .demandCommand()
  .help()
  .parse();
