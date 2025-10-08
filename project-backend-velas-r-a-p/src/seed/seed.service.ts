import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candle } from '../candle/entities/candle.entity';
import { Role } from '../common/role.enum';
import { Container } from '../container/entities/container.entity';
import { Fragance } from '../fragance/entities/fragance.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { ExtraProduct } from 'src/extra-product/entities/extra-product.entity';

@Injectable()
export class SeedService {
  constructor( @InjectRepository (User) private userRepository: Repository<User>,
               @InjectRepository (Fragance) private fraganceRepository: Repository<Fragance>,
               @InjectRepository (Container) private containerRepository: Repository<Container>,
               @InjectRepository (Candle) private candleRepository: Repository<Candle>,
               @InjectRepository (Order) private orderRepository: Repository<Order>,
               @InjectRepository (ExtraProduct) private extraProductRepository: Repository<ExtraProduct>,
  ) {}

  async seedDatabase() {
    await this.clearDatabase();
    await this.seedUsers();
    await this.seedFragances();
    await this.seedContainers();
    await this.seedCandles();
    await this.seedExtraProducts();
  }

  private async clearDatabase() {
    await Promise.all([
    this.extraProductRepository.delete({}),
    this.fraganceRepository.delete({}),
    this.containerRepository.delete({}),
    this.orderRepository.delete({}),
    this.candleRepository.delete({}),
    this.userRepository.delete({}),
    ])
  }

  private async seedUsers() {
    const usersData = [
      { name: 'Alejandro', email: 'alejoamu@gmail.com', password: '$2a$12$rZlnpzUJVfZNJCRq5uorWujPvk69hb/L9afjistWbfefGe8yh0EQG', roles:[Role.ADMIN, Role.USER]},
      { name: 'Rafaela', email: 'rafaelaruiz@gmail.com', password: '$2a$12$gpyBcZPYDLLC/hRLvFAUXugrU/gLjSiizwobyqVt3brOVfTOxWeoO', roles:[Role.ADMIN, Role.USER]},
      { name: 'Pablo', email: 'pablopineda@gmail.com', password: '$2a$12$6YrzwdwpFCIy8PwZEksDrO8somERJGS3ylA/tGlV5KW5sUQJ2OEEW', roles:[Role.ADMIN, Role.USER]},
      { name: 'User', email: 'user@gmail.com', password: '$2a$12$U4OqtvUBFGIu7PxJbGnzOuqyJMnGCbk9HMfG2Jq0EawlVj240swfW', roles:[Role.USER]}
    ]

    const users = await Promise.all(
      usersData.map(async (userData) => {
      const user = this.userRepository.create(userData);
      return this.userRepository.save(user);
      })
    )
    console.log(`Created ${users.length} users`);
    return users;
  }

  private async seedFragances() {
    const fragancesData = [
      //Opcion quiero decorar
      { name: 'Brisa de Lavanda', topNotes: 'Lavanda fresca', middleNotes: 'Jazmín, flor de azahar', baseNotes: 'Almizcle suave', image:'' },
      { name: 'Energía Floral', topNotes: 'Bergamota, flor de azahar', middleNotes: 'Peonía, jazmín', baseNotes: 'Sándalo', image:'' },
      { name: 'Amanecer Floral', topNotes: 'Neroli, bergamota', middleNotes: 'Jazmín, flor de loto', baseNotes: 'Almizcle blanco', image:'' },
      { name: 'Ritmo Floral', topNotes: 'Mandarina, flor de naranjo', middleNotes: 'Peonía, jazmín', baseNotes: 'Almizcle fresco', image:'' },
      { name: 'Brisa Floral', topNotes: 'Limón, flor de azahar', middleNotes: 'Jazmín, rosa blanca', baseNotes: 'Almizcle limpio', image:'' },
      { name: 'Hogar de Cedro', topNotes: 'Mandarina especiada', middleNotes: 'Cedro cálido, clavo', baseNotes: 'Ámbar suave, sándalo', image:'' },
      { name: 'Manto de Vainilla', topNotes: 'Vainilla bourbon', middleNotes: 'Haba tonka, flor de cacao', baseNotes: 'Maderas dulces, almizcle', image:'' },
      { name: 'Ámbar Crepuscular', topNotes: 'Pimienta rosa', middleNotes: 'Ámbar dorado', baseNotes: 'Resinas orientales, vainilla', image:'' },
      { name: 'Llama Interior', topNotes: 'Bergamota', middleNotes: 'Miel especiada, pachulí', baseNotes: 'Vetiver, ámbar tostado', image:'' },
      { name: 'Refugio Otoñal', topNotes: 'Naranja confitada', middleNotes: 'Canela, nuez moscada', baseNotes: 'Madera de roble', image:'' },
      //
      { name: 'Brisa Cítrica', topNotes: 'Lima verde, mandarina', middleNotes: 'Verbena, flor de azahar', baseNotes: 'Almizcle limpio', image:'' },
      { name: 'Verde Vital', topNotes: 'Hoja de higuera', middleNotes: 'Menta, albahaca', baseNotes: 'Vetiver, musgo' },
      { name: 'Rocío de Montaña', topNotes: 'Eucalipto', middleNotes: 'Lavanda fresca', baseNotes: 'Cedro blanco, notas acuáticas', image:'' },
      { name: 'Horizonte Marino', topNotes: 'Notas ozónicas', middleNotes: 'Algas marinas, jazmín', baseNotes: 'Almizcle azul', image:'' },
      { name: 'Despertar Cítrico', topNotes: 'Pomelo rosado', middleNotes: 'Flor de limón', baseNotes: 'Té verde, cedro claro', image:'' },
      //
      { name: 'Blanco Puro', topNotes: 'Limón, aldehídos', middleNotes: 'Jazmín blanco', baseNotes: 'Almizcle limpio', image:'' },
      { name: 'Niebla de Algodón', topNotes: 'Lavanda blanca', middleNotes: 'Iris, lirio', baseNotes: 'Sándalo, almizcle suave', image:'' },
      { name: 'Brisa Interior', topNotes: 'Limón fresco', middleNotes: 'Flor de azahar', baseNotes: 'Cedro suave, almizcle blanco', image:'' },
      { name: 'Aura de Bambú', topNotes: 'Bambú verde', middleNotes: 'Té blanco', baseNotes: 'Cedro claro, musgo fresco', image:'' },
      { name: 'Claridad Serena', topNotes: 'Lima, menta blanca', middleNotes: 'Salvia, lavanda', baseNotes: 'Almizcle, ámbar ligero', image:'' },
      //
      { name: 'Bosque Silente', topNotes: 'Pino fresco', middleNotes: 'Cedro, vetiver', baseNotes: 'Musgo, ámbar terroso', image:'' },
      { name: 'Tierra Viva', topNotes: 'Hoja de higuera', middleNotes: 'Lavanda silvestre', baseNotes: 'Pachulí, tierra húmeda', image:'' },
      { name: 'Caminos de Pino', topNotes: 'Eucalipto', middleNotes: 'Pino, resina', baseNotes: 'Cedro balsámico', image:'' },
      { name: 'Verde Profundo', topNotes: 'Galbanum', middleNotes: 'Hojas verdes, salvia', baseNotes: 'Musgo, madera húmeda', image:'' },
      { name: 'Sendero Herbal', topNotes: 'Albahaca fresca', middleNotes: 'Romero, tomillo', baseNotes: 'Vetiver', image:'' },
      //
      { name: 'Spa Silvestre', topNotes: 'Eucalipto, lima', middleNotes: 'Lavanda, salvia', baseNotes: 'Cedro, notas ozónicas', image:'' },
      { name: 'Cielo de Miel', topNotes: 'Lavanda, miel', middleNotes: 'Manzanilla, flor de naranjo', baseNotes: 'Vainilla, madera blanca', image:'' },
      { name: 'Agua Zen', topNotes: 'Pepino fresco', middleNotes: 'Té verde, flor de loto', baseNotes: 'Almizcle acuático', image:'' },
      { name: 'Jardín de Calma', topNotes: 'Lavanda', middleNotes: 'Magnolia, jazmín', baseNotes: 'Sándalo, almizcle', image:'' },
      { name: 'Paz Profunda', topNotes: 'Naranja dulce', middleNotes: 'Lavanda, neroli', baseNotes: 'Cedro, vainilla suave', image:'' },
      //
      { name: 'Mente Clara', topNotes: 'Menta, eucalipto', middleNotes: 'Salvia, lavanda', baseNotes: 'Almizcle fresco', image:'' },
      { name: 'Amanecer Verde', topNotes: 'Verbena, limón', middleNotes: 'Romero', baseNotes: 'Cedro', image:'' },
      { name: 'Bosque Lúcido', topNotes: 'Cedro, lima', middleNotes: 'Albahaca, vetiver', baseNotes: 'Madera clara', image:'' },
      { name: 'Luz Mental', topNotes: 'Pomelo, jengibre', middleNotes: 'Lavanda, té verde', baseNotes: 'Almizcle cítrico', image:'' },
      { name: 'Vitalidad Suave', topNotes: 'Bergamota', middleNotes: 'Geranio, menta', baseNotes: 'Vetiver, sándalo claro', image:'' },
      //
      { name: 'Noche de Lavanda', topNotes: 'Lavanda', middleNotes: 'Manzanilla, neroli', baseNotes: 'Sándalo', image:'' },
      { name: 'Luna de Seda', topNotes: 'Flor de azahar', middleNotes: 'Jazmín, almendra', baseNotes: 'Almizcle blanco, vainilla suave', image:'' },
      { name: 'Calma Nocturna', topNotes: 'Bergamota', middleNotes: 'Lavanda, rosa', baseNotes: 'Ámbar, maderas suaves', image:'' },
      { name: 'Susurro de Almizcle', topNotes: 'Notas aldehídicas', middleNotes: 'Iris, violeta', baseNotes: 'Almizcle blanco, madera de cachemira', image:'' },
      { name: 'Jardín al Anochecer', topNotes: 'Flor de tilo', middleNotes: 'Lavanda, magnolia', baseNotes: 'Madera blanca, vainilla', image:'' },
      //
      { name: 'Noche de Ámbar', topNotes: 'Pimienta rosa', middleNotes: 'Rosa, ámbar', baseNotes: 'Vainilla, benjuí' },
      { name: 'Piel de Seda', topNotes: 'Almendra, flor de azahar', middleNotes: 'Jazmín sambac', baseNotes: 'Almizcle sensual, madera cremosa', image:'' },
      { name: 'Vainilla Obscura', topNotes: 'Vainilla especiada', middleNotes: 'Orquídea, canela', baseNotes: 'Maderas exóticas, ámbar', image:'' },
      { name: 'Sombra de Cachemira', topNotes: 'Hojas secas', middleNotes: 'Iris empolvado', baseNotes: 'Madera de cachemira, ámbar gris', image:'' },
      { name: 'Deseo Oriental', topNotes: 'Mandarina roja', middleNotes: 'Rosa turca, incienso', baseNotes: 'Ámbar, oud suave', image:'' },
      //
      { name: 'Respirar Profundo', topNotes: 'Eucalipto, limón', middleNotes: 'Lavanda', baseNotes: 'Cedro blanco', image:'' },
      { name: 'Té y Silencio', topNotes: 'Té blanco', middleNotes: 'Magnolia, flor de loto', baseNotes: 'Almizcle suave', image:'' },
      { name: 'Aliento Floral', topNotes: 'Bergamota, naranja', middleNotes: 'Rosa blanca, geranio', baseNotes: 'Sándalo', image:'' },
      { name: 'Ritual de Lavanda', topNotes: 'Lavanda y salvia', middleNotes: 'Manzanilla', baseNotes: 'Madera clara', image:'' },
      { name: 'Conexión Interior', topNotes: 'Lima verde', middleNotes: 'Neroli, jazmín', baseNotes: 'Vainilla pura, almizcle blanco', image:'' },
      { name: 'Cielo de Algodón', topNotes: 'Aldehídos, flor de algodón', middleNotes: 'Iris, jazmín', baseNotes: 'Almizcle blanco', image:'' },
      { name: 'Blanco Sereno', topNotes: 'Limón ligero', middleNotes: 'Flor de lino', baseNotes: 'Sándalo cremoso', image:'' },
      { name: 'Lino Seco al Sol', topNotes: 'Lavanda blanca', middleNotes: 'Rosa de agua', baseNotes: 'Cedro, almizcle', image:'' },
      { name: 'Claridad Suave', topNotes: 'Lima', middleNotes: 'Lirio, jazmín', baseNotes: 'Almizcle puro', image:'' },
      { name: 'Viento de Paz', topNotes: 'Bergamota', middleNotes: 'Neroli', baseNotes: 'Cedro blanco, almizcle ligero', image:'' },
      { name: 'Rosas de Medianoche', topNotes: 'Rosa damascena', middleNotes: 'Violeta, magnolia', baseNotes: 'Madera suave, almizcle empolvado', image:'' },
      { name: 'Abrazo de Peonía', topNotes: 'Peonía rosada', middleNotes: 'Lirio, fresia', baseNotes: 'Sándalo, vainilla suave', image:'' },
      { name: 'Melodía de Flor', topNotes: 'Jazmín', middleNotes: 'Rosa blanca, gardenia', baseNotes: 'Almizcle dulce', image:'' },
      { name: 'Suspiros de Lila', topNotes: 'Lila, bergamota', middleNotes: 'Heliotropo, iris', baseNotes: 'Madera blanca', image:'' },
      { name: 'Romance de Té', topNotes: 'Té verde', middleNotes: 'Peonía, flor de azahar', baseNotes: 'Cedro claro, almizcle', image:'' },
      { name: 'Agua Clara', topNotes: 'Limón, menta', middleNotes: 'Eucalipto, flor de loto', baseNotes: 'Almizcle blanco', image:'' },
      { name: 'Brisa de Ducha', topNotes: 'Notas marinas', middleNotes: 'Jazmín acuático', baseNotes: 'Cedro ligero', image:'' },
      { name: 'Jabón de Sol', topNotes: 'Aldehídos, flor de algodón', middleNotes: 'Iris, lirio del valle', baseNotes: 'Almizcle limpio', image:'' },
      { name: 'Cítrico Puro', topNotes: 'Bergamota, lima', middleNotes: 'Lavanda, geranio', baseNotes: 'Cedro', image:'' },
      { name: 'Espuma de Agua', topNotes: 'Pepino, menta', middleNotes: 'Té blanco', baseNotes: 'Madera blanca, almizcle', image:'' },
      { name: 'Estallido Cítrico', topNotes: 'Naranja, mandarina', middleNotes: 'Jengibre, flor de azahar', baseNotes: 'Vetiver ligero', image:'' },
      { name: 'Amanecer Verde', topNotes: 'Hierba fresca, menta', middleNotes: 'Hoja de higuera, té verde', baseNotes: 'Madera clara', image:'' },
      { name: 'Despertar Solar', topNotes: 'Pomelo, limón', middleNotes: 'Neroli', baseNotes: 'Ámbar ligero', image:'' },
      { name: 'Brisa Cítrica', topNotes: 'Lima, albahaca', middleNotes: 'Lavanda, jazmín', baseNotes: 'Sándalo suave', image:'' },
      { name: 'Lluvia Tropical', topNotes: 'Maracuyá, bergamota', middleNotes: 'Flor de plumeria', baseNotes: 'Madera fresca', image:'' },
      { name: 'Spa Botánico', topNotes: 'Eucalipto, lavanda', middleNotes: 'Romero, salvia', baseNotes: 'Madera blanca', image:'' },
      { name: 'Té Azul', topNotes: 'Notas ozónicas, limón', middleNotes: 'Té azul, jazmín', baseNotes: 'Almizcle sereno', image:'' },
      { name: 'Aire Termal', topNotes: 'Pepino, aire acuático', middleNotes: 'Flor de loto', baseNotes: 'Sándalo ligero', image:'' },
      { name: 'Vapor Floral', topNotes: 'Agua de rosas', middleNotes: 'Lavanda y manzanilla', baseNotes: 'Cedro blanco', image:'' },
      { name: 'Ritual de Niebla', topNotes: 'Lima verde, jengibre', middleNotes: 'Magnolia, flor de naranjo', baseNotes: 'Madera húmeda', image:'' },
      { name: 'Baño de Seda', topNotes: 'Almendra dulce', middleNotes: 'Orquídea blanca, jazmín', baseNotes: 'Vainilla, almizcle suave', image:'' },
      { name: 'Ámbar en la Piel', topNotes: 'Pimienta rosa', middleNotes: 'Rosa, ámbar dorado', baseNotes: 'Vainilla, benjuí', image:'' },
      { name: 'Flor de Leche', topNotes: 'Coco suave', middleNotes: 'Frangipani, peonía', baseNotes: 'Vainilla, almizcle', image:'' },
      { name: 'Burbujas de Miel', topNotes: 'Bergamota dulce', middleNotes: 'Miel clara, flor blanca', baseNotes: 'Ámbar tibio', image:'' },
      { name: 'Velo Oriental', topNotes: 'Mandarina especiada', middleNotes: 'Incienso, rosa', baseNotes: 'Oud muy suave, vainilla oriental', image:'' },
      { name: 'Brisa de Albahaca', topNotes: 'Albahaca fresca, lima', middleNotes: 'Lavanda, geranio', baseNotes: 'Cedro claro', image:'' },
      { name: 'Hierba Cítrica', topNotes: 'Verbena, limón', middleNotes: 'Menta, flor de lima', baseNotes: 'Almizcle verde', image:'' },
      { name: 'Eucalipto Blanco', topNotes: 'Eucalipto y menta', middleNotes: 'Lavanda', baseNotes: 'Cedro fresco', image:'' },
      { name: 'Niebla de Cítricos', topNotes: 'Limón, mandarina', middleNotes: 'Hoja de naranjo', baseNotes: 'Vetiver suave', image:'' },
      { name: 'Rocío Herbal', topNotes: 'Romero, albahaca', middleNotes: 'Té verde', baseNotes: 'Madera clara', image:'' },
      { name: 'Jardín de Cocina', topNotes: 'Tomillo, albahaca', middleNotes: 'Salvia, lavanda', baseNotes: 'Cedro', image:'' },
      { name: 'Limón Verdeado', topNotes: 'Cáscara de limón, lima', middleNotes: 'Hoja de higuera', baseNotes: 'Madera blanca', image:'' },
      { name: 'Hoja Viva', topNotes: 'Hojas verdes, menta', middleNotes: 'Lavanda, romero', baseNotes: 'Musgo suave', image:'' },
      { name: 'Lavanda de Huerto', topNotes: 'Lavanda fresca', middleNotes: 'Flor de pomelo', baseNotes: 'Almizcle limpio', image:'' },
      { name: 'Tierra Cítrica', topNotes: 'Naranja amarga, albahaca', middleNotes: 'Raíz de vetiver', baseNotes: 'Tierra húmeda', image:'' },
      { name: 'Pastel de Manzana', topNotes: 'Manzana roja, canela', middleNotes: 'Clavo, nuez moscada', baseNotes: 'Vainilla cálida', image:'' },
      { name: 'Dulce Panal', topNotes: 'Miel, flor de naranjo', middleNotes: 'Manzanilla, leche', baseNotes: 'Vainilla suave', image:'' },
      { name: 'Horno Encendido', topNotes: 'Canela tostada', middleNotes: 'Masa dulce, nuez', baseNotes: 'Caramelo suave', image:'' },
      { name: 'Postre de Abuela', topNotes: 'Vainilla, azúcar moreno', middleNotes: 'Leche de coco, almendra', baseNotes: 'Mantequilla y madera', image:'' },
      { name: 'Té con Mermelada', topNotes: 'Frambuesa, bergamota', middleNotes: 'Rosa suave, té negro', baseNotes: 'Miel' },
      { name: 'Cítricos en Fiesta', topNotes: 'Naranja jugosa, lima', middleNotes: 'Mandarina, flor de azahar', baseNotes: 'Vetiver cítrico', image:'' },
      { name: 'Fruta Viva', topNotes: 'Piña, mango', middleNotes: 'Melocotón, flor tropical', baseNotes: 'Madera cremosa', image:'' },
      { name: 'Pomelo Rosa', topNotes: 'Pomelo, grosella roja', middleNotes: 'Rosa, hibiscus', baseNotes: 'Almizcle chispeante', image:'' },
      { name: 'Chispa Amarilla', topNotes: 'Limón amarillo, jengibre fresco', middleNotes: 'Verbena, menta', baseNotes: 'Cedro', image:'' },
      { name: 'Naranja Radiante', topNotes: 'Cáscara de naranja', middleNotes: 'Geranio', baseNotes: 'Almizcle claro', image:'' },
      { name: 'Claridad Verde', topNotes: 'Limón amarillo, menta fresca', middleNotes: 'Albahaca, lavanda', baseNotes: 'Cedro, almizcle ligero', image:'' },
      { name: 'Ritmo Zen', topNotes: 'Mandarina, eucalipto', middleNotes: 'Lavanda, té verde', baseNotes: 'Vetiver, madera clara', image:'' },
      { name: 'Brisa Mental', topNotes: 'Lima, menta', middleNotes: 'Salvia, romero', baseNotes: 'Cedro limpio', image:'' },
      { name: 'Minimalismo', topNotes: 'Bergamota', middleNotes: 'Flor blanca, lavanda', baseNotes: 'Cedro blanco', image:'' },
      { name: 'Punto de Enfoque', topNotes: 'Verbena, limón', middleNotes: 'Romero, geranio', baseNotes: 'Almizcle suave', image:'' },
      { name: 'Alma Creativa', topNotes: 'Naranja dulce, jengibre', middleNotes: 'Cedro cálido, geranio', baseNotes: 'Pachulí suave, ámbar claro', image:'' },
      { name: 'Luz Interior', topNotes: 'Pomelo rosa, lima', middleNotes: 'Peonía, flor de loto', baseNotes: 'Madera clara, almizcle', image:'' },
      { name: 'Mente Viva', topNotes: 'Mandarina, albahaca', middleNotes: 'Salvia, jazmín', baseNotes: 'Vetiver suave', image:'' },
      { name: 'Estudio Cálido', topNotes: 'Cardamomo, lavanda', middleNotes: 'Cedro, incienso suave', baseNotes: 'Sándalo, almizcle', image:'' },
      { name: 'Fulgor Dorado', topNotes: 'Naranja amarga', middleNotes: 'Flor de azahar', baseNotes: 'Ámbar dorado', image:'' },
      { name: 'Paz Mental', topNotes: 'Lavanda, bergamota', middleNotes: 'Manzanilla, rosa blanca', baseNotes: 'Cedro y almizcle', image:'' },
      { name: 'Mente Serena', topNotes: 'Mandarina, salvia', middleNotes: 'Flor de naranjo, jazmín', baseNotes: 'Vetiver, almizcle', image:'' },
      { name: 'Refugio Claro', topNotes: 'Hoja verde, verbena', middleNotes: 'Té blanco', baseNotes: 'Almizcle y madera limpia', image:'' },
      { name: 'Aire de Sabiduría', topNotes: 'Limón verde', middleNotes: 'Lavanda, clavo suave', baseNotes: 'Incienso sutil', image:'' },
      { name: 'Respiración Profunda', topNotes: 'Menta suave, anís', middleNotes: 'Salvia', baseNotes: 'Cedro claro', image:'' },
      
      //Opcion quiero sentirme
      { name: 'Calma Profunda', topNotes: 'Lavanda, bergamota', middleNotes: 'Manzanilla, rosa blanca', baseNotes: 'Sándalo, almizcle', image:'' },
      { name: 'Nube de Paz', topNotes: 'Té blanco', middleNotes: 'Peonía, flor de loto', baseNotes: 'Almizcle suave', image:'' },
      { name: 'Jardín Silente', topNotes: 'Nerolí', middleNotes: 'Jazmín, hojas verdes', baseNotes: 'Musgo blanco, ámbar ligero', image:'' },
      { name: 'Té y Lavanda', topNotes: 'Lavanda, cáscara de mandarina', middleNotes: 'Té verde, peonía', baseNotes: 'Cedro, almizcle', image:'' },
      { name: 'Paz Serena', topNotes: 'Bergamota', middleNotes: 'Lirio del valle, camomila', baseNotes: 'Madera de sándalo, vainilla suave', image:'' },
      { name: 'Vitalidad Cítrica', topNotes: 'Naranja, pomelo', middleNotes: 'Albahaca, jengibre', baseNotes: 'Vetiver ligero', image:'' },
      { name: 'Estallido Solar', topNotes: 'Hoja de higuera', middleNotes: 'Menta, albahaca', baseNotes: 'Vetiver, musgo', image:'' },
      { name: 'Menta Activa', topNotes: 'Menta, eucalipto', middleNotes: 'Albahaca, romero', baseNotes: 'Cedro blanco', image:'' },
      { name: 'Fórmula Energética', topNotes: 'Lima, toronja', middleNotes: 'Jengibre, pimienta rosa', baseNotes: 'Vetiver, almizcle', image:'' },
      { name: 'Sol de Mañana', topNotes: 'Bergamota, naranja', middleNotes: 'Ylang-ylang', baseNotes: 'Madera clara, ámbar', image:'' },
      { name: 'Noche de Ámbar', topNotes: 'Pimienta rosa', middleNotes: 'Rosa, jazmín', baseNotes: 'Ámbar, vainilla, almizcle', image:'' },
      { name: 'Piel de Seda', topNotes: 'Bergamota', middleNotes: 'Ylang-ylang', baseNotes: 'Almizcle blanco, haba tonka', image:'' },
      { name: 'Rosa Intensa', topNotes: 'Frambuesa, pimienta rosa', middleNotes: 'Rosa turca, peonía', baseNotes: 'Pachulí, almizcle', image:'' },
      { name: 'Vainilla Especiada', topNotes: 'Canela, clavo', middleNotes: 'Vainilla, jazmín', baseNotes: 'Resina, cuero suave', image:'' },
      { name: 'Jazmín Nocturno', topNotes: 'Nerolí', middleNotes: 'Jazmín Sambac', baseNotes: 'Ámbar gris, almizcle sensual', image:'' },
      { name: 'Alma Creativa', topNotes: 'Jengibre, mandarina', middleNotes: 'Cedro, peonía', baseNotes: 'Ámbar suave', image:'' },
      { name: 'Claridad Verde', topNotes: 'Limón, menta', middleNotes: 'Albahaca, lavanda', baseNotes: 'Cedro', image:'' },
      { name: 'Bruma Intelectual', topNotes: 'Albahaca, lima', middleNotes: 'Salvia, magnolia', baseNotes: 'Vetiver, almizcle', image:'' },
      { name: 'Chispa de Cedro', topNotes: 'Cedro rojo', middleNotes: 'Peonía, jengibre', baseNotes: 'Haba tonka, incienso', image:'' },
      { name: 'Horizonte Azul', topNotes: 'Lavanda, bergamota', middleNotes: 'Notas marinas, menta', baseNotes: 'Madera blanca, almizcle', image:'' },
      { name: 'Fuerza Noble', topNotes: 'Incienso', middleNotes: 'Cedro, cuero suave', baseNotes: 'Vetiver, ámbar oscuro', image:'' },
      { name: 'Tierra Firme', topNotes: 'Cardamomo', middleNotes: 'Madera de cachemira', baseNotes: 'Pachulí, cuero vegetal', image:'' },
      { name: 'Roble Profundo', topNotes: 'Salvia', middleNotes: 'Madera de roble', baseNotes: 'Incienso, cuero', image:'' },
      { name: 'Poder Sutil', topNotes: 'Bergamota, nuez moscada', middleNotes: 'Vetiver, jazmín seco', baseNotes: 'Madera ámbar', image:'' },
      { name: 'Escudo de Madera', topNotes: 'Romero', middleNotes: 'Cedro, enebro', baseNotes: 'Cuero, sándalo', image:'' },
      { name: 'Bosque Interior', topNotes: 'Hoja de higuera', middleNotes: 'Musgo, ciprés', baseNotes: 'Vetiver, madera húmeda', image:'' },
      { name: 'Raíces Vivas', topNotes: 'Pino, eucalipto', middleNotes: 'Cedro, salvia', baseNotes: 'Vetiver profundo', image:'' },
      { name: 'Lluvia en el Bosque', topNotes: 'Hierba fresca', middleNotes: 'Musgo de roble, bambú', baseNotes: 'Tierra mojada, madera', image:'' },
      { name: 'Sendero Natural', topNotes: 'Lavanda silvestre', middleNotes: 'Hojas verdes', baseNotes: 'Madera de cedro, musgo blanco', image:'' },
      { name: 'Verde Silvestre', topNotes: 'Hoja de menta, lima', middleNotes: 'Vetiver, geranio', baseNotes: 'Pino, ámbar natural', image:'' },

      //opcion quiero regalar
      { name: 'Dulce Gratitud', topNotes: 'Mandarina', middleNotes: 'Peonía', baseNotes: 'Vainilla blanca', image:'' },
      { name: 'Lluvia de Flores', topNotes: 'Pera', middleNotes: 'Flor de manzano, jazmín', baseNotes: 'Almizcle', image:'' },
      { name: 'Abrazo en Botella', topNotes: 'Lavanda', middleNotes: 'Rosa blanca', baseNotes: 'Madera de sándalo', image:'' },
      { name: 'Sonrisa Cálida', topNotes: 'Cítricos', middleNotes: 'Frambuesa, flor de azahar', baseNotes: 'Vainilla almizclada', image:'' },
      { name: 'Luz Interior', topNotes: 'Bergamota', middleNotes: 'Té blanco, mimosa', baseNotes: 'Almizcle blanco', image:'' },
      { name: 'Fiesta Floral', topNotes: 'Fresa', middleNotes: 'Rosa, lila', baseNotes: 'Caramelo suave', image:'' },
      { name: 'Brisa de Cumpleaños', topNotes: 'Mandarina', middleNotes: 'Magnolia, durazno', baseNotes: 'Azúcar moreno', image:'' },
      { name: 'Vainilla Alegre', topNotes: 'Limón dulce', middleNotes: 'Flor de almendro', baseNotes: 'Vainilla, haba tonka', image:'' },
      { name: 'Globos de Jazmín', topNotes: 'Naranja', middleNotes: 'Jazmín sambac', baseNotes: 'Ámbar dorado', image:'' },
      { name: 'Regalo de Sol', topNotes: 'Piña, naranja', middleNotes: 'Rosa, flor de maracuyá', baseNotes: 'Madera suave', image:'' },
      { name: 'Corazón de Rosa', topNotes: 'Rosa damascena', middleNotes: 'Peonía, lichi', baseNotes: 'Almizcle blanco', image:'' },
      { name: 'Dulzura de Tarde', topNotes: 'Frambuesa', middleNotes: 'Violeta, jazmín', baseNotes: 'Madera ámbar', image:'' },
      { name: 'Susurros de Vainilla', topNotes: 'Pimienta rosa', middleNotes: 'Vainilla', baseNotes: 'Sándalo, haba tonka', image:'' },
      { name: 'Romance Silvestre', topNotes: 'Cassis', middleNotes: 'Rosa silvestre, hojas verdes', baseNotes: 'Musgo blanco', image:'' },
      { name: 'Luna de Almizcle', topNotes: 'Mandarina', middleNotes: 'Flor blanca', baseNotes: 'Almizcle, benjuí', image:'' },
      { name: 'Silencio Floral', topNotes: 'Lavanda', middleNotes: 'Rosa blanca, magnolia', baseNotes: 'Sándalo, almizcle', image:'' },
      { name: 'Bruma de Paz', topNotes: 'Té blanco', middleNotes: 'Peonía, camomila', baseNotes: 'Madera clara', image:'' },
      { name: 'Lirio Blanco', topNotes: 'Bergamota', middleNotes: 'Lirio del valle, jazmín', baseNotes: 'Cedro suave, almizcle', image:'' },
      { name: 'Cálido Recuerdo', topNotes: 'Mandarina', middleNotes: 'Lavanda', baseNotes: 'Vainilla, ámbar suave', image:'' },
      { name: 'Consuelo Natural', topNotes: 'Hojas verdes', middleNotes: 'Musgo', baseNotes: 'Madera húmeda', image:'' },
      { name: 'Brindis de Azahar', topNotes: 'Cítricos', middleNotes: 'Flor de azahar, jazmín', baseNotes: 'Almizcle limpio', image:'' },
      { name: 'Éxito en Flor', topNotes: 'Toronja', middleNotes: 'Peonía rosa', baseNotes: 'Ámbar y cedro', image:'' },
      { name: 'Noticia Dulce', topNotes: 'Naranja sanguina', middleNotes: 'Magnolia, durazno', baseNotes: 'Vainilla', image:'' },
      { name: 'Rayo Dorado', topNotes: 'Limón', middleNotes: 'Té blanco', baseNotes: 'Madera clara', image:'' },
      { name: 'Flor de Triunfo', topNotes: 'Frambuesa', middleNotes: 'Jazmín, flor de maracuyá', baseNotes: 'Vetiver', image:'' },
      { name: 'Risa de Mandarina', topNotes: 'Mandarina', middleNotes: 'Flor de azahar', baseNotes: 'Vainilla blanca', image:'' },
      { name: 'Cítricos y Carcajadas', topNotes: 'Lima', middleNotes: 'Albahaca, geranio', baseNotes: 'Cedro', image:'' },
      { name: 'Dulce Encuentro', topNotes: 'Grosella', middleNotes: 'Rosa, peonía', baseNotes: 'Haba tonka, almizcle', image:'' },
      { name: 'Té con Amigos', topNotes: 'Té verde', middleNotes: 'Jazmín', baseNotes: 'Sándalo', image:'' },
      { name: 'Complicidad Floral', topNotes: 'Naranja dulce', middleNotes: 'Lila, peonía', baseNotes: 'Musgo blanco', image:'' },
      { name: 'Navidad de Especias', topNotes: 'Canela, naranja', middleNotes: 'Clavo, jazmín', baseNotes: 'Vainilla, cedro', image:'' },
      { name: 'Bosque Nevado', topNotes: 'Pino, eucalipto', middleNotes: 'Cedro', baseNotes: 'Incienso, almizcle', image:'' },
      { name: 'Dulce Invierno', topNotes: 'Mandarina', middleNotes: 'Caramelo suave, flor de vainilla', baseNotes: 'Madera tostada', image:'' },
      { name: 'Estrella de Navidad', topNotes: 'Pimienta rosa', middleNotes: 'Rosa, canela', baseNotes: 'Ámbar y benjuí', image:'' },
      { name: 'Chimenea Encendida', topNotes: 'Nuez moscada', middleNotes: 'Cedro rojo', baseNotes: 'Cuero, resina ámbar', image:'' },
      { name: 'Respeto Floral', topNotes: 'Limón', middleNotes: 'Rosa blanca, té verde', baseNotes: 'Cedro', image:'' },
      { name: 'Oficio Noble', topNotes: 'Bergamota', middleNotes: 'Lavanda', baseNotes: 'Cuero suave, vetiver', image:'' },
      { name: 'Vocación Pura', topNotes: 'Pomelo', middleNotes: 'Magnolia, salvia', baseNotes: 'Madera blanca', image:'' },
      { name: 'Dedicación en Flor', topNotes: 'Fresa', middleNotes: 'Peonía, jazmín', baseNotes: 'Almizcle', image:'' },
      { name: 'Profesional Inspirador', topNotes: 'Lima', middleNotes: 'Romero, lavanda', baseNotes: 'Sándalo, almizcle', image:'' }
    ];
  
    const fragances = await Promise.all(
      fragancesData.map(async (fraganceData) => {
        const fragance = this.fraganceRepository.create(fraganceData);
        return this.fraganceRepository.save(fragance);
      })
    );
  
    console.log(`Created ${fragances.length} fragances`);
    return fragances;
  }

  private async seedContainers() {
    const containersData = [
      { name: 'Glassy 1', material: 'Vidrio', diameter: 10, height: 10, image:'' },
      { name: 'Glassy 2', material: 'Vidrio', diameter: 8, height: 10, image:'' },
    ];
  
    const containers = await Promise.all(
      containersData.map(async (containerData) => {
        const container = this.containerRepository.create(containerData);
        return this.containerRepository.save(container);
      })
    );
  
    console.log(`Created ${containers.length} containers`);
    return containers;
  }

  private async seedCandles() {
    
  }

  private async seedExtraProducts() {
    const extraProductsData = [
      { name: 'Chocolates', price: 42500, description:'Caja de chocolates Ferrero Rocher', image:'https://florilandiaexpress.shop/wp-content/uploads/2018/08/peluches-y-regalos-corazon-floristeria-a-domicilio-florilandia.jpg' },
      { name: 'Flores', price: 19990, description:'Ramo de rosas', image:'https://i0.wp.com/floralii.mx/wp-content/uploads/2023/07/Ramo-chico-de-Rosas-rosas-y-Astromelia-2.webp?fit=800%2C1000&ssl=1' },
      { name: 'Sales para baño', price: 27000, description:'Sales para baño', image:'https://lusciousbath.com/wp-content/uploads/2021/01/luscious-sales-de-bano.jpg' },
      { name: 'Vino', price: 42000, description:'Vino tinto', image:'https://exitocol.vteximg.com.br/arquivos/ids/26657859/Vino-Tinto-Cabernet-Sauvignon-X-750-ml-233880_a.jpg' },
      { name: 'Imagen de la virgen', price: 30000, description:'Imagen de la virgen enmarcada', image:'https://cantia.com.mx/cdn/shop/files/A17267_3ec6faf4-ddc4-4fd8-98fb-7a4dceee370d.png?v=1731624193' },
      { name: 'Jabones en gicerina', price: 23200, description:'Jabones en gicerina', image:'https://www.drogueriasanjorge.com/wp-content/uploads/2024/04/7701684072330-scaled-1.jpg' },
    ];

    const extraProducts = await Promise.all(
      extraProductsData.map(async (extraProductData) => {
        const extraProduct = this.extraProductRepository.create(extraProductData);
        return this.extraProductRepository.save(extraProduct);
      })
    );

    console.log(`Created ${extraProducts.length} extra products`);
    return extraProducts;
  }

}