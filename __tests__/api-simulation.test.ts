
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/generate-doc/route';
import { NextRequest } from 'next/server';

// Mock DB and Schema
vi.mock('@/lib/db', () => ({
    db: {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
    }
}));

vi.mock('@/lib/db/schema', () => ({
    auditEvents: {},
    builderPromotions: { fix_code: 'fix_code', promoted: 'promoted' }
}));

vi.mock('drizzle-orm', () => ({
    eq: vi.fn()
}));

// Mock Rate Limit
vi.mock('@/lib/rate-limit', () => ({
    checkRateLimit: vi.fn().mockResolvedValue(true)
}));

// Mock Environment
// process.env.NODE_ENV = 'test';

describe('API Integration: generate-doc', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('NODE_ENV', 'test');
    });

    it('should return 400 if required fields are missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/generate-doc', {
            method: 'POST',
            body: JSON.stringify({})
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toContain('Faltan datos');
    });

    it('should generate docx buffer for valid data', async () => {
        const validData = {
            razonSocial: 'Test Corp',
            rutEmpresa: '11.111.111-1',
            nombreCompleto: 'Juan Test',
            rutRepresentante: '22.222.222-2',
            cargo: 'Gerente',
            domicilio: 'Calle Falsa',
            comuna: 'Santiago',
            region: 'RM',
            numTrabajadores: '10-25',
            rubro: 'Comercio',
            trabajoRemoto: 'no',
            horasExtras: 'si',
            gratificacion: 'mensual'
        };

        const req = new NextRequest('http://localhost:3000/api/generate-doc', {
            method: 'POST',
            body: JSON.stringify(validData)
        });

        const res = await POST(req);

        // If audit fails or warnings exist, it might return 422. 
        // But with perfect data it should return 200.
        // If it returns 200, it sends a Buffer.

        if (res.status === 422) {
            const json = await res.json();
            console.log('Validation errors:', json);
        }

        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')).toContain('wordprocessingml.document');
    });
});
