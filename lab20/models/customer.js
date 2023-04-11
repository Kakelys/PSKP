module.exports = (prisma) => {
    return {
        async getAll () {
            return prisma.customer.findMany();
        },
        async getById (id) {
            return prisma.customer.findUnique({
                where: {
                    id: +id
                }
            });
        },
        async create (customer) {
            return prisma.customer.create({
                data: {
                    name: customer.name,
                    phone: customer.phone
                }
            });
        },
        async delete (id) {
            return prisma.customer.delete({
                where: {
                    id: +id
                }
            });
        },
        async update (id, customer) {
            return prisma.customer.update({
                where: {
                    id: +id
                },
                data: {
                    name: customer.name,
                    phone: customer.phone
                }
            });
        }
    }
}