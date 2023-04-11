module.exports = (prisma) => {
    return {
        async getAll () {
            return prisma.office.findMany({
                include: {
                    country: true
                }
            });
        },
        async getById (id) {
            return prisma.office.findUnique({
                where: {
                    id: +id
                }
            });
        },
        async create (office) {
            return prisma.office.create({
                data: {
                    name: office.name,
                    address: office.address,
                    phone: office.phone,
                    email: office.email,
                    country_id: +office.countryId
                }
            });
        },
        async delete (id) {
            return prisma.office.delete({
                where: {
                    id: +id
                }
            });
        },
        async update (id, office) {
            return prisma.office.update({
                where: {
                    id: +id
                },
                data: {
                    address: office.address,
                    phone: office.phone,
                    email: office.email,
                    country_id: +office.countryId
                }
            });
        }
    }
}