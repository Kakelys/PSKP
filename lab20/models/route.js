module.exports = (prisma) => {
    return {
        async getAll () {
            return prisma.route.findMany({
                include: {
                    countryFrom: true,
                    countryTo: true
                }
            });
        },
        async getById (id) {
            return prisma.route.findUnique({
                where: {
                    id: +id
                },
                include: {
                    countryFrom: true,
                    countryTo: true
                }
            });
        },
        async create (route) {
            return prisma.route.create({
                data: {
                    from_country_id: +route.countryFromId,
                    to_country_id: +route.countryToId,
                    price: +route.price
                }
            });
        },
        async delete (id) {
            return prisma.route.delete({
                where: {
                    id: +id
                }
            });
        },
        async update (id, route) {
            return prisma.route.update({
                where: {
                    id: +id
                },
                data: {
                    from_country_id: +route.countryFromId,
                    to_country_id: +route.countryToId,
                    price: +route.price
                }
            });
        }
    }
}