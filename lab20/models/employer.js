module.exports = (prisma) => {
    return {
        async getAll () {
            return prisma.employer.findMany({
                include: {
                    office: true
                }
            });
        },
        async getById (id) {
            return prisma.employer.findUnique({
                where: {
                    id: +id
                }
            });
        },
        async create (employer) {
            return prisma.employer.create({
                data: {
                    name: employer.name,
                    phone: employer.phone,
                    email: employer.email,
                    office_id: +employer.officeId
                }
            });
        },
        async delete (id) {
            return prisma.employer.delete({
                where: {
                    id: +id
                }
            });
        },
        async update (id, employer) {
            return prisma.employer.update({
                where: {
                    id: +id
                },
                data: {
                    name: employer.name,
                    phone: employer.phone,
                    email: employer.email
                }
            });
        }
    }
}