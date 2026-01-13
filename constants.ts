
import { SOV_ID, SovereigntyObjective, SEAL_LEVEL, SEAL_Definition, Language } from './types';

export const getSovereigntyObjectives = (lang: Language): SovereigntyObjective[] => {
  if (lang === 'en') {
    return [
      {
        id: SOV_ID.SOV1,
        name: 'Strategic Sovereignty',
        weight: 0.15,
        description: 'Anchoring in the EU legal, financial, and industrial ecosystem.',
        factors: [
          'Decision-making authority located in EU jurisdiction.',
          'Assurance against changes of control.',
          'Dependence on funding from EU sources.',
          'Investment, jobs, and value creation in the EU.',
          'Consistency with EU digital, green, and industrial objectives.',
          'Ability to maintain operations in the face of external requests for cessation.'
        ]
      },
      {
        id: SOV_ID.SOV2,
        name: 'Legal and Jurisdictional Sovereignty',
        weight: 0.10,
        description: 'Legal environment, exposure to foreign authorities, and enforceability of rights.',
        factors: [
          'National legal system governing operations and contracts.',
          'Degree of exposure to extra-community laws (e.g., US CLOUD Act).',
          'Legal or technical channels of forced access by non-EU authorities.',
          'Applicability of restrictive international regimes.',
          'Jurisdiction of creation and registration of intellectual property (IP).'
        ]
      },
      {
        id: SOV_ID.SOV3,
        name: 'Data and AI Sovereignty',
        weight: 0.10,
        description: 'Protection, control, and independence of data assets and AI services.',
        factors: [
          'Exclusive customer control over cryptographic access.',
          'Visibility and auditability of data access and AI use.',
          'Strict confinement of storage and processing in the EU.',
          'Development and governance of AI models under EU control.'
        ]
      },
      {
        id: SOV_ID.SOV4,
        name: 'Operational Sovereignty',
        weight: 0.15,
        description: 'Practical ability to execute and evolve technology independently.',
        factors: [
          'Ease of migration without vendor lock-in.',
          'Capability of management and support without involving non-EU providers.',
          'Existence of specialized local talent in the EU.',
          'Operational support delivered from the EU under local laws.',
          'Availability of complete technical documentation and source code.',
          'Legal control of critical subcontractors.'
        ]
      },
      {
        id: SOV_ID.SOV5,
        name: 'Supply Chain Sovereignty',
        weight: 0.20,
        description: 'Geographical origin, transparency, and resilience of the technology chain.',
        factors: [
          'Geographical origin of critical physical components.',
          'Jurisdiction and source of firmware/hardware code.',
          'Place of architecture and software programming.',
          'Degree of dependence on non-EU proprietary facilities or technologies.',
          'Visibility and audit rights for the entire supply chain.'
        ]
      },
      {
        id: SOV_ID.SOV6,
        name: 'Technological Sovereignty',
        weight: 0.15,
        description: 'Degree of openness, transparency, and independence of the technology stack.',
        factors: [
          'Use of documented and non-proprietary APIs and protocols.',
          'Software accessible under open licenses (Open Source).',
          'Visibility in the design and operation of the service.',
          'Independence in high-performance computing (HPC).'
        ]
      },
      {
        id: SOV_ID.SOV7,
        name: 'Security and Compliance Sovereignty',
        weight: 0.10,
        description: 'Control of security operations and compliance obligations.',
        factors: [
          'Obtainment of EU certifications (e.g., ENISA, ISO).',
          'Adherence to GDPR, NIS2, DORA.',
          'SOC and response teams operating exclusively under EU jurisdiction.',
          'Autonomy of maintenance and application of security patches.',
          'Capability to perform independent audits with full access.'
        ]
      },
      {
        id: SOV_ID.SOV8,
        name: 'Environmental Sustainability',
        weight: 0.05,
        description: 'Autonomy and resilience in relation to the use of energy and raw materials.',
        factors: [
          'Adoption of energy-efficient infrastructure (low PUE).',
          'Circular economy practices and end-of-life management.',
          'Transparency in carbon emissions measurement.',
          'Use of renewable energy in infrastructure.'
        ]
      }
    ];
  }
  
  // Default Spanish
  return [
    {
      id: SOV_ID.SOV1,
      name: 'Soberanía Estratégica',
      weight: 0.15,
      description: 'Anclaje en el ecosistema legal, financiero e industrial de la UE.',
      factors: [
        'Autoridad decisoria ubicada en jurisdicción UE.',
        'Aseguramiento contra cambios de control.',
        'Dependencia de financiación de fuentes UE.',
        'Inversión, empleos y creación de valor en la UE.',
        'Consistencia con objetivos digitales, verdes e industriales de la UE.',
        'Capacidad de mantener operaciones ante solicitudes de cese externas.'
      ]
    },
    {
      id: SOV_ID.SOV2,
      name: 'Soberanía Legal y Jurisdiccional',
      weight: 0.10,
      description: 'Entorno legal, exposición a autoridades extranjeras y exigibilidad de derechos.',
      factors: [
        'Sistema legal nacional que rige operaciones y contratos.',
        'Grado de exposición a leyes extra-comunitarias (ej. US CLOUD Act).',
        'Canales legales o técnicos de acceso forzado por autoridades no-UE.',
        'Aplicabilidad de regímenes internacionales restrictivos.',
        'Jurisdicción de creación y registro de propiedad intelectual (IP).'
      ]
    },
    {
      id: SOV_ID.SOV3,
      name: 'Soberanía de Datos e IA',
      weight: 0.10,
      description: 'Protección, control e independencia de activos de datos y servicios de IA.',
      factors: [
        'Control exclusivo del cliente sobre el acceso criptográfico.',
        'Visibilidad y auditabilidad de acceso a datos y uso de IA.',
        'Confinamiento estricto de almacenamiento y procesado en la UE.',
        'Desarrollo y gobernanza de modelos de IA bajo control UE.'
      ]
    },
    {
      id: SOV_ID.SOV4,
      name: 'Soberanía Operativa',
      weight: 0.15,
      description: 'Capacidad práctica de ejecutar y evolucionar la tecnología independientemente.',
      factors: [
        'Facilidad de migración sin bloqueo del proveedor (lock-in).',
        'Capacidad de gestión y soporte sin involucrar proveedores no-UE.',
        'Existencia de talento local especializado en la UE.',
        'Soporte operativo entregado desde la UE bajo leyes locales.',
        'Disponibilidad de documentación técnica completa y código fuente.',
        'Control legal de subcontratistas críticos.'
      ]
    },
    {
      id: SOV_ID.SOV5,
      name: 'Soberanía de la Cadena de Suministro',
      weight: 0.20,
      description: 'Origen geográfico, transparencia y resiliencia de la cadena tecnológica.',
      factors: [
        'Origen geográfico de componentes físicos críticos.',
        'Jurisdicción y procedencia del código de firmware/hardware.',
        'Lugar de arquitectura y programación del software.',
        'Grado de dependencia de instalaciones o tecnologías propietarias no-UE.',
        'Visibilidad y derechos de auditoría de toda la cadena de suministro.'
      ]
    },
    {
      id: SOV_ID.SOV6,
      name: 'Soberanía Tecnológica',
      weight: 0.15,
      description: 'Grado de apertura, transparencia e independencia del stack tecnológico.',
      factors: [
        'Uso de APIs y protocolos documentados y no propietarios.',
        'Software accesible bajo licencias abiertas (Open Source).',
        'Visibilidad en el diseño y funcionamiento del servicio.',
        'Independencia en computación de alto rendimiento (HPC).'
      ]
    },
    {
      id: SOV_ID.SOV7,
      name: 'Soberanía de Seguridad y Cumplimiento',
      weight: 0.10,
      description: 'Control de operaciones de seguridad y obligaciones de cumplimiento.',
      factors: [
        'Obtención de certificaciones UE (ej. ENISA, ISO).',
        'Adherencia a GDPR, NIS2, DORA.',
        'SOC y equipos de respuesta operando exclusivamente bajo jurisdicción UE.',
        'Autonomía de mantenimiento y aplicación de parches de seguridad.',
        'Capacidad de realizar auditorías independientes con acceso total.'
      ]
    },
    {
      id: SOV_ID.SOV8,
      name: 'Sostenibilidad Ambiental',
      weight: 0.05,
      description: 'Autonomía y resiliencia en relación al uso de energía y materias primas.',
      factors: [
        'Adopción de infraestructura energéticamente eficiente (PUE bajo).',
        'Prácticas de economía circular y gestión de fin de vida.',
        'Transparencia en la medición de emisiones de carbono.',
        'Uso de energía renovable en la infraestructura.'
      ]
    }
  ];
};

export const getSealDefinitions = (lang: Language): SEAL_Definition[] => {
  if (lang === 'en') {
    return [
      { level: SEAL_LEVEL.SEAL0, name: 'No Sovereignty', description: 'Exclusive control by non-EU third parties.' },
      { level: SEAL_LEVEL.SEAL1, name: 'Jurisdictional Sovereignty', description: 'EU law formally applies but with limited practical applicability.' },
      { level: SEAL_LEVEL.SEAL2, name: 'Data Sovereignty', description: 'EU law applicable and enforceable, with material dependencies outside the EU.' },
      { level: SEAL_LEVEL.SEAL3, name: 'Digital Resilience', description: 'EU actors exercising significant but not total influence.' },
      { level: SEAL_LEVEL.SEAL4, name: 'Total Digital Sovereignty', description: 'Complete EU control, subject only to EU laws, without external dependencies.' }
    ];
  }
  return [
    { level: SEAL_LEVEL.SEAL0, name: 'Sin Soberanía', description: 'Control exclusivo de terceros no pertenecientes a la UE.' },
    { level: SEAL_LEVEL.SEAL1, name: 'Soberanía Jurisdiccional', description: 'La legislación de la UE se aplica formalmente pero con una aplicabilidad práctica limitada.' },
    { level: SEAL_LEVEL.SEAL2, name: 'Soberanía de Datos', description: 'Legislación de la UE aplicable y exigible, con dependencias materiales fuera de la UE.' },
    { level: SEAL_LEVEL.SEAL3, name: 'Resiliencia Digital', description: 'Actores de la UE ejerciendo una influencia significativa pero no total.' },
    { level: SEAL_LEVEL.SEAL4, name: 'Soberanía Digital Total', description: 'Control completo de la UE, sujeto únicamente a leyes de la UE, sin dependencias críticas externas.' }
  ];
};
