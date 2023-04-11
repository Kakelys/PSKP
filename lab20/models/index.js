const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
    country: require('./country')(prisma),
    customer: require('./customer')(prisma),
    office: require('./office')(prisma),
    employer: require('./employer')(prisma),
    route: require('./route')(prisma)
}