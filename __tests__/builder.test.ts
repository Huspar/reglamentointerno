
import { describe, it, expect } from 'vitest';
import { buildReglamento } from '@/lib/builder';
import { type ReglamentoData } from '@/lib/builder/types';

describe('Reglamento Builder', () => {
    const mockData: ReglamentoData = {
        razonSocial: 'Test Corp',
        rutEmpresa: '11.111.111-1',
        nombreCompleto: 'Juan Test',
        rutRepresentante: '22.222.222-2',
        cargo: 'Gerente',
        domicilio: 'Calle Falsa 123',
        comuna: 'Santiago',
        region: 'Metropolitana',
        numTrabajadores: '10-25',
        rubro: 'Comercio',
        trabajoRemoto: 'no',
        giro: 'Venta',
        email: 'test@example.com',
        categoriaRiesgo: 'baja',
        jornadaGeneral: '45',
        controlAsistencia: 'libro',
        usoEPP: 'si',
        comiteParitario: 'no',
        mutualidad: 'ACHS',
        prohibiciones: [],
        tipoProcedimiento: 'investigacion',
        procedimientoDisciplinario: 'estandar',
        flexibleLegalWording: false
    };

    it('should generate sections', () => {
        const sections = buildReglamento(mockData);
        expect(sections.length).toBeGreaterThan(0);
    });

    it('should include General Rules chapter', () => {
        const sections = buildReglamento(mockData);
        const generalChapter = sections.find(s => s.title.includes('NORMAS GENERALES'));
        expect(generalChapter).toBeDefined();
    });

    it('should include Remote Work chapter only if enabled', () => {
        const noRemote = buildReglamento({ ...mockData, trabajoRemoto: 'no' });
        expect(noRemote.some(s => s.title.includes('TELETRABAJO'))).toBe(false);

        const withRemote = buildReglamento({ ...mockData, trabajoRemoto: 'si' });
        expect(withRemote.some(s => s.title.includes('TELETRABAJO'))).toBe(true);
    });
});
