import asyncio
from sqlalchemy import select
from app.db.postgres import SessionLocal, engine, Base
from app.models.user import Role, User
from app.core.security import get_password_hash

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        # 1. Create Roles
        roles = ["admin", "student", "faculty", "warden"]
        for role_name in roles:
            result = await db.execute(select(Role).where(Role.name == role_name))
            role = result.scalars().first()
            if not role:
                role = Role(name=role_name, description=f"{role_name.capitalize()} Role")
                db.add(role)
        await db.commit()

        # 2. Create Superuser
        result = await db.execute(select(User).where(User.email == "admin@college.com"))
        user = result.scalars().first()
        if not user:
            # Get admin role
            result = await db.execute(select(Role).where(Role.name == "admin"))
            admin_role = result.scalars().first()

            user = User(
                email="admin@college.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Super Admin",
                is_active=True,
                is_superuser=True,
                role_id=admin_role.id
            )
            db.add(user)
        await db.commit()

        # 3. Create Demo Student
        result = await db.execute(select(User).where(User.email == "student@college.com"))
        student = result.scalars().first()
        if not student:
            result = await db.execute(select(Role).where(Role.name == "student"))
            student_role = result.scalars().first()

            student = User(
                email="student@college.com",
                hashed_password=get_password_hash("student123"),
                full_name="John Doe",
                is_active=True,
                is_superuser=False,
                role_id=student_role.id
            )
            db.add(student)
        await db.commit()

        # 4. Create Demo Faculty
        result = await db.execute(select(User).where(User.email == "faculty@college.com"))
        faculty = result.scalars().first()
        if not faculty:
            result = await db.execute(select(Role).where(Role.name == "faculty"))
            faculty_role = result.scalars().first()

            faculty = User(
                email="faculty@college.com",
                hashed_password=get_password_hash("faculty123"),
                full_name="Dr. Smith",
                is_active=True,
                is_superuser=False,
                role_id=faculty_role.id
            )
            db.add(faculty)
        await db.commit()

if __name__ == "__main__":
    asyncio.run(init_db())
