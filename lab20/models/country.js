module.exports = (prisma) => {
    return {
        getAll: async () => {
            return await prisma.country.findMany();
        },
        getById: async (id) => {
            return await prisma.country.findUnique({
                where: {
                    id: +id
                }
            });
        },
        create: async (country) => {
            return await prisma.country.create({
                data: {
                    name: country.name
                }
            });
        },
        delete: async (id) => {
            return await prisma.country.delete({
                where: {
                    id: +id
                }
            });
        },
        update: async (id, country) => {
            return await prisma.country.update({
                where: {
                    id: +id
                },
                data: {
                    name: country.name
                }
            });
        }
    }
}