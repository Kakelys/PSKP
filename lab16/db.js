const {Pool} = require('pg');

var config = {
    user: 'postgres', 
    database: 'noda_lab', 
    password: '.Qwerty1%', 
    host: 'localhost', 
    port: 5432, 
    max: 10, // max number of clients in the pool
    min: 4,
    idleTimeoutMillis: 30000
};
const pool = new Pool(config);

function DB(){
    this.getFaculties = async (faculty) => {
        let result;
        if(faculty){
            result = await pool.query(`select * from faculty where faculty = '${faculty}';`);
            return result.rows[0];
        }

        result = await pool.query(`select * from faculty;`);
        return result.rows;
    }

    this.getTeachers = async (teacher) => {
        let result;
        if(teacher){
            result = await pool.query(`select * from teacher where teacher = '${teacher}';`);
            return result.rows[0];
        }

        result = await pool.query(`select * from teacher;`);
        return result.rows;
    }

    this.getPulpits = async (pulpit) => {
        let result;
        if(pulpit){
            result = await pool.query(`select * from pulpit where pulpit = '${pulpit}';`);
            return result.rows[0];
        }

        result = await pool.query(`select * from pulpit;`);
        return result.rows;
    }

    this.getSubjects = async (subject) => {
        let result;
        if(subject){
            result = await pool.query(`select * from subject where subject = '${subject}';`);
            return result.rows[0];
        }

        result = await pool.query(`select * from subject;`);
        return result.rows;
    }

    this.getTeacherByFaculty = async (faculty) => {
        let result = await pool.query(`
            select * from teacher t
            JOIN pulpit p 
                ON p.pulpit = t.pulpit
            where p.faculty = '${faculty}';`);
        return result.rows;
    }

    this.getPulpitsByFaculty = async (faculty) => {
        let result = await pool.query(`
            select * from pulpit p
            join subject s 
                ON s.pulpit = p.pulpit
            where p.faculty = '${faculty}'`);
        return result.rows;
    }

    this.setFaculty = async (fac, fac_name) => {
        let fc = await pool.query(`
            select * from faculty where faculty = '${fac}';   
        `);

        if(fc.rows.length > 0)
            await pool.query(`update faculty set faculty_name = '${fac_name}'`)
        else
            await pool.query(`insert into faculty(faculty, faculty_name) values('${fac}', '${fac_name}');`);
        
        return {faculty: fac, faculty_name: fac_name};
    }

    this.setTeacher = async (teach, teach_name, pulp) => {
        let q = await pool.query(`
            select * from teacher where teacher = '${teach}';   
        `);

        if(q.rows.length > 0)
            await pool.query(`update teacher set teacher_name = '${teach_name}', pulpit = '${pulp}';`)
        else
            await pool.query(`insert into teacher(teacher, teacher_name, pulpit) values('${teach}', '${teach_name}', '${pulp}');`);
        
        return {teacher: teach, teacher_name: teach_name, pulpit: pulp};
    }

    this.setSubject = async (subj, subj_name, pulp) => {
        let q = await pool.query(`
            select * from subject where subject = '${subj}';   
        `);

        if(q.rows.length > 0)
            await pool.query(`update subject set subject_name = '${subj_name}'`)
        else
            await pool.query(`insert into subject(subject, subject_name, pulpit) values('${subj}', '${subj_name}', '${pulp}');`);
        
        return {subject: subj, subject_name: subj_name, pulpit: pulpit};
    }

    this.setPulpit = async (pulp, pulp_name, faculty) => {
        let q = await pool.query(`
            select * from pulpit where pulpit = '${pulp}';   
        `);

        if(q.rows.length > 0)
            await pool.query(`update pulpit set pulpit_name = '${pulp_name}'`)
        else
            await pool.query(`insert into pulpit(pulpit, pulpit_name, faculty) values('${pulp}', '${pulp_name}', '${faculty}');`);
        
        return {pulpit: pulp, pulpit_name: pulp_name, faculty: faculty};
    }

    this.deleteFaculty = async (faculty) => {
        let q = await pool.query(`
            select * from faculty where faculty = '${faculty}';   
        `);

        if(q.rows.length > 0)
            await pool.query(`delete from faculty where faculty = '${faculty}'`)
        else    
            return null;
        
        return {faculty: q.rows[0].faculty, faculty_name: q.rows[0].faculty_name}
    }

    this.deleteTeacher = async (teacher) => {
        let q = await pool.query(`
            select * from teacher where teacher = '${teacher}';   
        `);

        if(q.rows.length > 0)
            await pool.query(`delete from teacher where teacher = '${teacher}'`)
        else    
            return null;
        
        return {teacher: q.rows[0].teacher, teacher_name: q.rows[0].teacher_name, pulpit: q.rows[0].pulpit}
    }

    this.deleteSubject = async (subject) => {
        let q = await pool.query(`
            select * from subject where subject = '${subject}';   
        `);

        if(q.rows.length > 0)
            await pool.query(`delete from subject where subject = '${subject}'`)
        else    
            return null;
        
        return {subject: q.rows[0].subject, subject_name: q.rows[0].subject_name, pulpit: q.rows[0].pulpit}
    }

    this.deletePulpit = async (pulpit) => {
        let q = await pool.query(`
            select * from pulpit where pulpit = '${pulpit}';   
        `);

        if(q.rows.length > 0)
            await pool.query(`delete from pulpit where pulpit = '${pulpit}'`)
        else    
            return null;
        
        return {pulpit: q.rows[0].pulpit, pulpit_name: q.rows[0].pulpit_name, faculty: q.rows[0].faculty}
    }
}

const resolver = {
    faculties: async (args, context) => {
        let f = await context.getFaculties();
        return await f.map(async el => Object.assign(el, {pulpits: await context.getPulpitsByFaculty(el.faculty)}));
    },
    faculty: async (args, context) => {
        let f = await context.getFaculties(args.faculty);
        console.log(f);
        return Object.assign(f, {pulpits: await context.getPulpitsByFaculty(f.faculty)});
    },
    pulpits: async (args,context) => {return await context.getPulpits();},
    pulpit: async (args,context) => {return await context.getPulpits(args.pulpit);},
    teachers: async (args,context) => {
        try{
        let f = await context.getTeachers();
        return await  f.map(el => Object.assign(el));
        }
        catch(err){console.log(err)}
    },
    teacher: async (args, context) => {
        let f = await context.getTeachers(args.teacher);
        return Object.assign(f);
    },
    set_faculty: async (args,context) => {
        let f = await context.setFaculty(args.faculty.faculty, args.faculty.faculty_name);
        return Object.assign(f, {pulpits: await context.getPulpitsByFaculty(f.faculty)});
    },
    set_teacher: async (args,context) => {
        let f = await context.setTeacher(args.teacher.teacher, args.teacher.teacher_name, args.teacher.pulpit);
        return Object.assign(f);
    },
    set_subject: async (args,context) => {
        let f = await context.setTeacher(args.subject.subject, args.subject.subject_name, args.subject.pulpit);
        return Object.assign(f);
    },
    set_pulpit: async (args,context) => {
        let f = await context.setTeacher(args.pulpit.pulpit, args.pulpit.pulpit_name, args.pulpit.faculty);
        return Object.assign(f);
    },
    del_faculty: async (args,context) => {
        let f = await context.deleteFaculty(args.faculty);
        return Object.assign(f);
    },
    del_teacher: async (args,context) => {
        let f = await context.deleteTeacher(args.teacher);
        return Object.assign(f);
    },
    del_subject: async (args,context) => {
        let f = await context.deleteSubject(args.subject);
        return Object.assign(f);
    },
    del_pulpit: async (args,context) => {
        let f = await context.deletePulpit(args.pulpit);
        return Object.assign(f);
    }
}

exports.DB = new DB();
exports.resolver = resolver;
